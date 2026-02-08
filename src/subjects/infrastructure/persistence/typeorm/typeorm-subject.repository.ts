import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectEntity } from '../../../domain/entities/subject.entity';
import { SubjectRepository } from '../../../domain/repositories/subject.repository';
import { FindSubjectsFiltersDto } from '../../../application/dto/find-subjects-filters.dto';

@Injectable()
export class TypeOrmSubjectRepository implements SubjectRepository {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly repository: Repository<SubjectEntity>,
  ) {}

  async findAll(): Promise<SubjectEntity[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: ['department', 'courses', 'courses.academicYears'],
      order: { subjectId: 'ASC' },
    });
  }

  async findAllWithFilters(filters: FindSubjectsFiltersDto): Promise<{ data: SubjectEntity[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.department', 'department')
      .leftJoinAndSelect('subject.courses', 'course')
      .leftJoinAndSelect('course.academicYears', 'academicYear');

    // Aplicar filtros específicos
    if (filters.subjectCode !== undefined) {
      queryBuilder.andWhere('subject.subjectCode LIKE :subjectCode', {
        subjectCode: `%${filters.subjectCode}%`,
      });
    }

    if (filters.name !== undefined) {
      queryBuilder.andWhere('subject.name LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('subject.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters.departmentName !== undefined) {
      queryBuilder.andWhere('department.name LIKE :departmentName', {
        departmentName: `%${filters.departmentName}%`,
      });
    }

    if (filters.courseCode !== undefined) {
      queryBuilder.andWhere('course.courseCode LIKE :courseCode', {
        courseCode: `%${filters.courseCode}%`,
      });
    }

    // Aplicar búsqueda global (cada término se busca con OR en múltiples campos, y los términos se combinan con AND)
    if (filters.globalSearch && filters.globalSearch.length > 0) {
      filters.globalSearch.forEach((term, index) => {
        const paramName = `globalSearch${index}`;
        queryBuilder.andWhere(
          `(subject.subjectCode LIKE :${paramName} OR subject.name LIKE :${paramName} OR department.name LIKE :${paramName} OR course.courseCode LIKE :${paramName} OR course.name LIKE :${paramName})`,
          { [paramName]: `%${term}%` },
        );
      });
    }

    // Usar DISTINCT para evitar duplicados por las relaciones ManyToMany
    queryBuilder.distinct(true);

    // Contar el total antes de aplicar paginación
    const total = await queryBuilder.getCount();

    // Aplicar paginación
    const skip = (filters.page - 1) * filters.limit;
    queryBuilder.skip(skip).take(filters.limit);

    // Ordenar resultados
    queryBuilder.orderBy('subject.subjectId', 'ASC');

    // Ejecutar la consulta
    const data = await queryBuilder.getMany();

    return { data, total };
  }

  async findOneById(subjectId: number): Promise<SubjectEntity | null> {
    return this.repository.findOne({
      where: { subjectId },
      relations: ['department', 'courses', 'courses.academicYears'],
    });
  }

  async findOneActiveById(subjectId: number): Promise<SubjectEntity | null> {
    return this.repository.findOne({
      where: { subjectId, isActive: true },
      relations: ['department', 'courses', 'courses.academicYears'],
    });
  }

  async findOneBySubjectCode(subjectCode: string): Promise<SubjectEntity | null> {
    return this.repository.findOne({
      where: { subjectCode },
    });
  }

  async save(subject: SubjectEntity): Promise<SubjectEntity> {
    return this.repository.save(subject);
  }
}
