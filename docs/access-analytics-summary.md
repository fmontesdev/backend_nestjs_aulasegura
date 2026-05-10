# Resumen agregado de analíticas de accesos

`GET /access/analytics/summary` devuelve una foto agregada de los access logs para alimentar el tab **Analíticas** sin descargar páginas de logs ni agrupar en el frontend.

## Ruta rápida

```http
GET /access/analytics/summary?date=today&limit=5
```

Requiere autenticación y rol `ADMIN`, igual que `GET /access/logs`.

## Qué problema resuelve

Antes, el frontend tenía que descargar logs paginados y agruparlos manualmente para construir KPIs, rankings y actividad por horas. Eso era frágil porque la paginación no representa el conjunto completo del rango.

Ahora la agregación vive en backend y usa directamente `access_log` dentro del rango solicitado.

## Query params

| Parámetro | Valores | Default | Uso |
|---|---|---|---|
| `date` | `today`, `week`, `month` | `today` | Rango temporal calculado en `Europe/Madrid`. |
| `limit` | `1` a `50` | `5` | Límite para `topDeniedRooms` y `topDeniedUsers`. |

## Respuesta

```json
{
  "kpis": {
    "totalAccesses": 356,
    "allowedAccesses": 320,
    "deniedAccesses": 28,
    "denialRate": 7.9
  },
  "topDeniedRooms": [
    {
      "roomId": 12,
      "roomCode": "Aula 25",
      "roomName": "Aula 25",
      "building": 1,
      "floor": 2,
      "deniedCount": 8
    }
  ],
  "topDeniedUsers": [
    {
      "userId": "uuid",
      "name": "Juan",
      "lastname": "Pérez",
      "email": "juan@demo.com",
      "avatar": null,
      "roles": ["teacher"],
      "deniedCount": 5
    }
  ],
  "hourlyActivity": [
    {
      "hour": 8,
      "total": 24,
      "allowed": 20,
      "denied": 2,
      "timeout": 1,
      "exit": 1
    }
  ]
}
```

## Reglas de cálculo

| Campo | Cálculo |
|---|---|
| `totalAccesses` | Total de logs dentro del rango. |
| `allowedAccesses` | Logs con `accessStatus = allowed`. |
| `deniedAccesses` | Logs con `accessStatus = denied`. |
| `denialRate` | `deniedAccesses / totalAccesses * 100`, redondeado a 1 decimal. Si no hay logs, `0`. |
| `topDeniedRooms` | Logs denegados agrupados por aula y ordenados por `deniedCount DESC`; incluye `building` y `floor`. |
| `topDeniedUsers` | Logs denegados agrupados por usuario y ordenados por `deniedCount DESC`; incluye todos los `roles` del usuario. |
| `hourlyActivity` | Actividad agrupada por hora del día en `Europe/Madrid`, con desglose `allowed`, `denied`, `timeout` y `exit`. |

> Nota: `roles` devuelve los valores del enum `RoleName` del backend. Actualmente son `admin`, `teacher`, `janitor` y `support_staff`.

## Decisión V1 sobre actividad por horas

`hourlyActivity` siempre devuelve 24 buckets, de `0` a `23`.

- Para `date=today`, cada bucket representa esa hora del día actual.
- Para `date=week` y `date=month`, cada bucket acumula todas las ocurrencias de esa hora dentro del rango completo.
- Las horas sin datos se devuelven con `total`, `allowed`, `denied`, `timeout` y `exit` a `0`.

Esta decisión mantiene un contrato estable para el frontend: el gráfico siempre puede pintar las 24 horas sin rellenar huecos manualmente.

## Arquitectura de la implementación

El endpoint respeta la estructura hexagonal del módulo `access`:

| Capa | Archivo | Responsabilidad |
|---|---|---|
| Presentation | `src/access/presentation/controllers/access.controller.ts` | Expone `GET /access/analytics/summary`, aplica guards y delega. |
| Presentation DTO | `src/access/presentation/dto/requests/get-access-analytics-summary-query.request.dto.ts` | Valida `date` y `limit`, y documenta Swagger. |
| Presentation DTO | `src/access/presentation/dto/responses/access-analytics-summary.response.dto.ts` | Define el contrato de respuesta para Swagger. |
| Application DTO | `src/access/application/dto/access-analytics-summary.dto.ts` | Define tipos internos del resumen agregado. |
| Application Service | `src/access/application/services/access.service.ts` | Orquesta el caso de uso y delega al repositorio. |
| Domain Repository | `src/access/domain/repositories/access-log.repository.ts` | Declara `getAnalyticsSummary(dateFilter, limit)`. |
| Infrastructure | `src/access/infrastructure/persistence/typeorm/typeorm-access-log.repository.ts` | Consulta logs del rango y calcula agregados. |
| Common | `src/common/utils/madrid-timezone.util.ts` | Añade `getMadridHour()` para agrupar por hora en Madrid. |

El controller NO contiene lógica de agregación. Solo recibe query params, aplica seguridad y llama al servicio.

## Flujo interno

1. `AccessController.getAnalyticsSummary()` recibe `date` y `limit`.
2. Si faltan, aplica defaults: `date=today`, `limit=5`.
3. `AccessService.getAnalyticsSummary()` delega en `AccessLogRepository`.
4. `TypeOrmAccessLogRepository.getAnalyticsSummary()`:
   - calcula el rango con `getMadridDayRange`, `getMadridWeekRange` o `getMadridMonthRange`;
   - carga logs del rango con relaciones `user`, `user.roles` y `room`;
   - calcula KPIs;
   - agrupa denegaciones por aula y usuario;
   - agrupa actividad por hora usando `getMadridHour()`.

## Seguridad

El endpoint usa la misma protección que el historial:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN)
```

Esto significa:

- requiere JWT válido;
- requiere rol `ADMIN`;
- funciona con la estrategia actual de cookies httpOnly / Bearer fallback.

## Decisiones de implementación

| Decisión | Motivo |
|---|---|
| `limit` solo aplica a rankings | Los KPIs y la actividad horaria deben representar todo el rango, NO solo el top N. |
| `limit` default `5` | Coincide con el contrato pedido y da un ranking compacto para UI. |
| `limit` máximo `50` | Evita respuestas enormes por accidente sin bloquear casos razonables. |
| `hourlyActivity` siempre tiene 24 buckets | El frontend puede renderizar sin rellenar huecos manualmente. |
| `week/month` agrupan por hora del día, no por día | V1 mantiene el mismo shape que `today`; si se necesita tendencia diaria, será otro endpoint/campo. |
| Solo `denied` cuenta como denegación | `timeout` y otros estados quedan fuera de `deniedAccesses` porque el contrato especifica `access_status = "denied"`. |
| `total` horario incluye todos los estados | Así el gráfico horario representa toda la actividad real, no solo permitidos/denegados. |
| `roles` usa `RoleName[]` | Mantiene el mismo formato de roles que el resto de la API (`admin`, `teacher`, etc.). |

## Ejemplos de uso

Hoy con ranking por defecto:

```http
GET /access/analytics/summary
```

Semana actual con top 10:

```http
GET /access/analytics/summary?date=week&limit=10
```

Mes actual con top 3:

```http
GET /access/analytics/summary?date=month&limit=3
```

## Casos borde

| Caso | Resultado |
|---|---|
| No hay logs en el rango | KPIs a `0`, rankings vacíos y 24 horas con ceros. |
| Hay logs `timeout` o `exit` | Suman en `totalAccesses`, `hourlyActivity.total` y su campo específico; no suman en `allowed` ni `denied`. |
| Hora sin datos | Bucket presente con `total: 0`, `allowed: 0`, `denied: 0`, `timeout: 0`, `exit: 0`. |
| Empate en ranking de aulas | Se ordena por `roomId` ascendente como desempate estable. |
| Empate en ranking de usuarios | Se ordena por `userId` ascendente como desempate estable. |

## Verificación

Tests dirigidos:

```bash
npm test -- --runInBand typeorm-access-log.repository.spec.ts access.service.spec.ts access-log.mapper.spec.ts
```

Casos cubiertos:

- KPIs y `denialRate`.
- rankings de aulas y usuarios denegados agrupados y ordenados.
- `topDeniedRooms` incluye `building` y `floor`.
- `topDeniedUsers` incluye `roles`.
- `hourlyActivity` cuenta `allowed`, `denied`, `timeout` y `exit`.
- 24 horas para `today`, incluyendo todos los campos a cero cuando no hay datos.
- `total` horario coincide con la suma real de todos los estados.
- `denialRate = 0` y rankings vacíos cuando no hay logs.
