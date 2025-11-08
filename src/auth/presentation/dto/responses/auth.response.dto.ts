import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DepartmentEntity } from 'src/departments/domain/entities/department.entity';

export class AuthResponse {
  @ApiProperty({ description: 'Access token JWT' })
  accessToken?: string | null;

  @ApiProperty({ description: 'Refresh token JWT' })
  refreshToken?: string | null;

  @ApiProperty({
    description: 'Identificador del usuario (UUID v4)',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId!: string;

  @ApiProperty({ description: 'Nombre del usuario autenticado' })
  name!: string;

  @ApiProperty({ description: 'Apellidos del usuario autenticado' })
  lastname!: string;

  @ApiProperty({ format: 'email', description: 'Email del usuario autenticado' })
  email!: string;

  @ApiPropertyOptional({ nullable: true, description: 'Archivo de imagen del avatar o null' })
  avatar!: string | null;

  @ApiProperty({
    description: 'Roles del usuario',
    example: ['admin', 'teacher', 'janitor', 'support_staff'],
    isArray: true,
  })
  roles!: string[];

  @ApiPropertyOptional({
    description: 'Departamento al que pertenece el usuario (solo para teachers)',
    type: () => DepartmentEntity,
    nullable: true,
  })
  department!: DepartmentEntity | null;
}
