import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from '../../../domain/entities/department.entity';
import { DepartmentRepository } from '../../../domain/repositories/department.repository';
import { FindDepartmentsFiltersDto } from '../../../application/dto/find-departments-filters.dto';

@Injectable()
export class TypeOrmDepartmentRepository implements DepartmentRepository {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly repository: Repository<DepartmentEntity>,
  ) {}

  async findAll(): Promise<DepartmentEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { departmentId: 'ASC' },
    });
  }

  // Utilizados leftJoinAndSelect (QueryBuilder) para poder listar departamentos aunque no tengan subjects o teachers asociados
  async findAllWithFilters(filters: FindDepartmentsFiltersDto): Promise<{ data: DepartmentEntity[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.subjects', 'subject', 'subject.isActive = :subjectActive', { subjectActive: true })
      .leftJoinAndSelect('subject.courses', 'course')
      .leftJoinAndSelect('course.academicYears', 'academicYear')
      .leftJoinAndSelect('department.teachers', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user');

    // Aplicar filtros específicos
    if (filters.name !== undefined) {
      queryBuilder.andWhere('department.name LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('department.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters.subjectCode !== undefined) {
      queryBuilder.andWhere('subject.subjectCode LIKE :subjectCode', {
        subjectCode: `%${filters.subjectCode}%`,
      });
    }

    if (filters.teacherName !== undefined) {
      queryBuilder.andWhere('(user.name LIKE :teacherName OR user.lastname LIKE :teacherName OR CONCAT(user.name, " ", user.lastname) LIKE :teacherName)', {
        teacherName: `%${filters.teacherName}%`,
      });
    }

    // Aplicar búsqueda global (cada término se busca con OR en múltiples campos, y los términos se combinan con AND)
    if (filters.globalSearch && filters.globalSearch.length > 0) {
      filters.globalSearch.forEach((term, index) => {
        const paramName = `globalSearch${index}`;
        queryBuilder.andWhere(
          `(department.name LIKE :${paramName} OR subject.subjectCode LIKE :${paramName} OR user.name LIKE :${paramName} OR user.lastname LIKE :${paramName} OR CONCAT(user.name, " ", user.lastname) LIKE :${paramName})`,
          { [paramName]: `%${term}%` },
        );
      });
    }

    // Usar DISTINCT para evitar duplicados por las relaciones OneToMany
    queryBuilder.distinct(true);

    // Contar el total antes de aplicar paginación
    const total = await queryBuilder.getCount();

    // Aplicar paginación
    const skip = (filters.page - 1) * filters.limit;
    queryBuilder.skip(skip).take(filters.limit);

    // Ordenar resultados
    queryBuilder.orderBy('department.departmentId', 'ASC');

    // Ejecutar la consulta
    const data = await queryBuilder.getMany();

    // Post-procesar para filtrar asignaturas inactivas y profesores con validTo expirado
    const currentDate = new Date();
    const filteredData = data.map(department => {
      // Filtrar profesores cuyo user.validTo sea posterior a hoy o sea null
      if (department.teachers && department.teachers.length > 0) {
        department.teachers = department.teachers.filter(teacher => {
          return teacher.user && (!teacher.user.validTo || teacher.user.validTo > currentDate);
        });
      }
      return department;
    });

    return { data: filteredData, total };
  }

  async findOneById(departmentId: number): Promise<DepartmentEntity | null> {
    return this.repository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.subjects', 'subject')
      .leftJoinAndSelect('subject.courses', 'course')
      .leftJoinAndSelect('course.academicYears', 'academicYear', 'academicYear.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('department.teachers', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('department.departmentId = :departmentId', { departmentId })
      .getOne();
  }

  async findOneActiveById(departmentId: number): Promise<DepartmentEntity | null> {
    return this.repository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.subjects', 'subject')
      .leftJoinAndSelect('subject.courses', 'course')
      .leftJoinAndSelect('course.academicYears', 'academicYear', 'academicYear.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('department.teachers', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .where('department.departmentId = :departmentId', { departmentId })
      .andWhere('department.isActive = :isActive', { isActive: true })
      .getOne();
  }

  async save(department: DepartmentEntity): Promise<DepartmentEntity> {
    return this.repository.save(department);
  }
}
