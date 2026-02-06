import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { RoleEntity } from '../../../domain/entities/role.entity';
import { TeacherEntity } from '../../../domain/entities/teacher.entity';
import { FindUsersFiltersDto, PaginatedResult, UserState } from '../../../application/dto/find-users-filters.dto';

@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
  ) {}

  async findAllWithFilters(filters: FindUsersFiltersDto): Promise<PaginatedResult<UserEntity>> {
    const { page, limit, globalSearch, fullName, email, roles, departmentName, state } = filters;

    // Crear query builder
    const query = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.teacher', 'teacher')
      .leftJoinAndSelect('teacher.department', 'department');

    // JOIN adicional solo para filtrar (no para cargar datos) - evita que se filtren las relaciones
    const needsRoleFilter = (globalSearch && globalSearch.length > 0) || (roles && roles.length > 0);
    if (needsRoleFilter) {
      query.leftJoin('user.roles', 'roleFilter');
    }

    // Aplicar búsqueda global (busca en múltiples campos)
    if (globalSearch && globalSearch.length > 0) {
      const globalConditions: string[] = [];
      const globalParams: any = {};

      globalSearch.forEach((term, index) => {
        const paramName = `global${index}`;
        
        // Condiciones base: nombre, apellido, nombre completo, email y departamento
        // COALESCE convierte NULL en '' para evitar que usuarios sin departamento aparezcan en búsquedas
        const basicConditions = [
          `LOWER(user.name) LIKE LOWER(:${paramName})`,
          `LOWER(user.lastname) LIKE LOWER(:${paramName})`,
          `LOWER(CONCAT(user.name, ' ', user.lastname)) LIKE LOWER(:${paramName})`,
          `LOWER(user.email) LIKE LOWER(:${paramName})`,
          `LOWER(COALESCE(department.name, '')) LIKE LOWER(:${paramName})`
        ];

        globalParams[paramName] = `%${term}%`;
        
        // Combinar todas las condiciones con OR para cada término
        globalConditions.push(`(${basicConditions.join(' OR ')})`);
      });

      // Combinar con AND para que todos los términos globales coincidan
      query.andWhere(`(${globalConditions.join(' AND ')})`, globalParams);
    }

    // Aplicar filtros específicos
    if (fullName) {
      query.andWhere(
        '(LOWER(user.name) LIKE LOWER(:fullName) OR LOWER(user.lastname) LIKE LOWER(:fullName) OR LOWER(CONCAT(user.name, \' \', user.lastname)) LIKE LOWER(:fullName))',
        { fullName: `%${fullName}%` }
      );
    }

    if (email) {
      query.andWhere('LOWER(user.email) LIKE LOWER(:email)', { email: `%${email}%` });
    }

    if (roles && roles.length > 0) {
      query.andWhere('roleFilter.name IN (:...roles)', { roles });
    }

    if (departmentName) {
      query.andWhere('LOWER(department.name) LIKE LOWER(:departmentName)', { departmentName: `%${departmentName}%` });
    }

    // Filtro por estado (activo/inactivo)
    if (state === UserState.ACTIVE) {
      // Activos: validTo es null O validTo > fecha actual
      query.andWhere('(user.validTo IS NULL OR user.validTo > :now)', { now: new Date() });
    } else if (state === UserState.INACTIVE) {
      // Inactivos: validTo no es null Y validTo <= fecha actual
      query.andWhere('user.validTo IS NOT NULL AND user.validTo <= :now', { now: new Date() });
    }

    // Ordenar por fecha de creación descendente
    query.orderBy('user.createdAt', 'DESC');

    // Evitar duplicados cuando usamos el JOIN adicional para filtrar roles
    if (needsRoleFilter) {
      query.distinct(true);
    }

    // Calcular offset
    const offset = (page - 1) * limit;

    // Ejecutar query con paginación
    const [data, total] = await query
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    // Calcular total de páginas
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOneById(userId: string): Promise<UserEntity | null> {
    return await this.userRepo.findOne({ 
      where: { userId },
      relations: ['roles', 'teacher', 'teacher.department'] 
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepo.findOne({ 
      where: { email },
      relations: ['roles', 'teacher', 'teacher.department'] 
    });
  }

  async findTeacherByUserId(userId: string): Promise<TeacherEntity | null> {
    return await this.teacherRepo.findOne({ where: { userId } });
  }

  async findRoleByName(name: string): Promise<RoleEntity | null> {
    return await this.roleRepo.findOne({ where: { name: name as any } });
  }

  create(data: Partial<UserEntity>): UserEntity {
    return this.userRepo.create(data);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return await this.userRepo.save(user);
  }

  async saveTeacher(teacher: TeacherEntity): Promise<TeacherEntity> {
    return await this.teacherRepo.save(teacher);
  }

  async deleteById(userId: string): Promise<void> {
    await this.userRepo.delete(userId);
  }

  async deleteTeacher(userId: string): Promise<void> {
    await this.teacherRepo.delete({ userId });
  }

  async existsById(userId: string): Promise<boolean> {
    const count = await this.userRepo.count({ where: { userId } });
    return count > 0;
  }
}
