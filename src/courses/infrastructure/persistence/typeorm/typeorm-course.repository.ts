import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from '../../../domain/entities/course.entity';
import { CourseRepository } from '../../../domain/repositories/course.repository';
import { FindCoursesFiltersDto } from '../../../application/dto/find-courses-filters.dto';

@Injectable()
export class TypeOrmCourseRepository implements CourseRepository {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly repository: Repository<CourseEntity>,
  ) {}

  async findAllWithFilters(filters: FindCoursesFiltersDto): Promise<{ data: CourseEntity[]; total: number }> {
    const { page = 1, limit = 10, globalSearch, courseCode, name, educationStage, levelNumber, cfLevel, isActive } = filters;

    const query = this.repository.createQueryBuilder('course')
      .leftJoinAndSelect('course.academicYears', 'academicYear')
      .andWhere('academicYear.isActive = :academicYearActive', { academicYearActive: true })
      .distinct(true);

    // Aplicar búsqueda global (cada término debe coincidir en courseCode O name)
    // Los múltiples términos se combinan con AND
    if (globalSearch && globalSearch.length > 0) {
      const globalConditions: string[] = [];
      const globalParams: any = {};

      globalSearch.forEach((term, index) => {
        const paramName = `global${index}`;
        
        // Cada término busca en courseCode O name
        const basicConditions = [
          `LOWER(course.courseCode) LIKE LOWER(:${paramName})`,
          `LOWER(course.name) LIKE LOWER(:${paramName})`,
        ];

        globalParams[paramName] = `%${term}%`;
        
        // Combinar con OR para cada término
        globalConditions.push(`(${basicConditions.join(' OR ')})`);
      });

      // Combinar todos los términos con AND
      query.andWhere(`(${globalConditions.join(' AND ')})`, globalParams);
    }

    // Aplicar filtros específicos
    if (courseCode) {
      query.andWhere('LOWER(course.courseCode) LIKE LOWER(:courseCode)', { courseCode: `%${courseCode}%` });
    }

    if (name) {
      query.andWhere('LOWER(course.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }
    if (educationStage) {
      query.andWhere('course.educationStage = :educationStage', { educationStage });
    }

    if (levelNumber !== undefined) {
      query.andWhere('course.levelNumber = :levelNumber', { levelNumber });
    }

    if (cfLevel) {
      query.andWhere('course.cfLevel = :cfLevel', { cfLevel });
    }

    if (isActive !== undefined) {
      query.andWhere('course.isActive = :isActive', { isActive });
    }

    // Ordenar por código de curso
    query.orderBy('course.courseCode', 'ASC');

    // Paginación
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    // Obtener resultados y total
    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  async findOneById(courseId: number): Promise<CourseEntity | null> {
    return this.repository.findOne({
      where: { courseId },
      relations: ['academicYears'],
    });
  }

  async findOneActiveById(courseId: number): Promise<CourseEntity | null> {
    return this.repository.findOne({
      where: { courseId, isActive: true, academicYears: {isActive: true} },
      relations: ['academicYears'],
    });
  }

  async findOneByCourseCode(courseCode: string): Promise<CourseEntity | null> {
    return this.repository.findOne({
      where: { courseCode },
    });
  }

  async save(course: CourseEntity): Promise<CourseEntity> {
    return this.repository.save(course);
  }
}
