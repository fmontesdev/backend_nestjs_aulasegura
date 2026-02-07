import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { FindCoursesFiltersDto } from '../dto/find-courses-filters.dto';
import { AcademicYearService } from '../../../academic-years/application/services/academic-year.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly academicYearService: AcademicYearService,
  ) {}

  /// Busca cursos con paginación y filtros
  async findAllWithFilters(filters: FindCoursesFiltersDto): Promise<{ data: CourseEntity[]; total: number }> {
    return await this.courseRepository.findAllWithFilters(filters);
  }

  /// Busca un curso por ID o lanza una excepción si no se encuentra
  async findOne(courseId: number): Promise<CourseEntity> {
    return await this.findCourseByIdOrFail(courseId);
  }

  /// Crea un nuevo curso después de verificar que el código es único
  async create(createDto: CreateCourseDto): Promise<CourseEntity> {
    // Verificar que el código del curso sea único
    await this.ensureCourseCodeIsUnique(createDto.courseCode);

    // Verificar que el año académico exista y esté activo
    const academicYear = await this.academicYearService.findByCode(createDto.academicYearCode);

    // Crear el nuevo curso
    const course = new CourseEntity();
    course.courseCode = createDto.courseCode;
    course.name = createDto.name;
    course.educationStage = createDto.educationStage;
    course.levelNumber = createDto.levelNumber;
    course.cfLevel = createDto.cfLevel ?? null;
    course.isActive = true;
    course.academicYears = [academicYear];

    // Guarda en la base de datos
    try {
      return await this.courseRepository.save(course);
    } catch (error) {
      throw new ConflictException(`Course with code ${createDto.courseCode} could not be created`);
    }
  }

  /// Actualiza un curso existente
  async update(courseId: number, updateDto: UpdateCourseDto): Promise<CourseEntity> {
    const course = await this.findCourseByIdOrFail(courseId);

    // Si se quiere cambiar el código, verificar unicidad
    if (updateDto.courseCode && updateDto.courseCode !== course.courseCode) {
      await this.ensureCourseCodeIsUnique(updateDto.courseCode);
      course.courseCode = updateDto.courseCode;
    }

    // Actualizar otros campos si vienen en el DTO
    if (updateDto.name !== undefined) {
      course.name = updateDto.name;
    }

    if (updateDto.educationStage !== undefined) {
      course.educationStage = updateDto.educationStage;
    }

    if (updateDto.levelNumber !== undefined) {
      course.levelNumber = updateDto.levelNumber;
    }

    if (updateDto.cfLevel !== undefined) {
      course.cfLevel = updateDto.cfLevel;
    }

    if (updateDto.isActive !== undefined) {
      course.isActive = updateDto.isActive;
    }

    // Si se quiere cambiar el año académico
    if (updateDto.academicYearCode) {
      const academicYear = await this.academicYearService.findByCode(updateDto.academicYearCode);
      course.academicYears = [academicYear];
    }

    return await this.courseRepository.save(course);
  }

  /// Desactiva un curso (soft delete)
  async softRemove(courseId: number): Promise<void> {
    const course = await this.findActiveCourseByIdOrFail(courseId);
    course.isActive = false;
    await this.courseRepository.save(course);
  }

  //? ================= Métodos auxiliares =================

  //? Busca un curso por ID o lanza una excepción si no se encuentra
  private async findCourseByIdOrFail(courseId: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOneById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return course;
  }

  //? Busca un curso activo por ID o lanza una excepción si no se encuentra
  private async findActiveCourseByIdOrFail(courseId: number): Promise<CourseEntity> {
    const course = await this.courseRepository.findOneActiveById(courseId);
    if (!course) {
      throw new NotFoundException(`Active course with ID ${courseId} not found`);
    }
    return course;
  }

  //? Verifica que el código del curso sea único
  private async ensureCourseCodeIsUnique(courseCode: string): Promise<void> {
    const existing = await this.courseRepository.findOneByCourseCode(courseCode);
    if (existing) {
      throw new ConflictException(`Course with code ${courseCode} already exists`);
    }
  }
}
