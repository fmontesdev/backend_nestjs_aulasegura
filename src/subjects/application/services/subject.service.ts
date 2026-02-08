import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { SubjectEntity } from '../../domain/entities/subject.entity';
import { SubjectRepository } from '../../domain/repositories/subject.repository';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { FindSubjectsFiltersDto } from '../dto/find-subjects-filters.dto';
import { CourseService } from '../../../courses/application/services/course.service';
import { DepartmentService } from '../../../departments/application/services/department.service';
import { DepartmentEntity } from 'src/departments/domain/entities/department.entity';
import { CourseEntity } from 'src/courses/domain/entities/course.entity';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly courseService: CourseService,
    @Inject(forwardRef(() => DepartmentService)) // Resuelve la dependencia circular
    private readonly departmentService: DepartmentService,
  ) {}

  /// Busca asignaturas con paginación y filtros
  async findAllWithFilters(filters: FindSubjectsFiltersDto): Promise<{ data: SubjectEntity[]; total: number }> {
    return await this.subjectRepository.findAllWithFilters(filters);
  }

  /// Busca una asignatura por ID o lanza una excepción si no se encuentra
  async findOne(subjectId: number): Promise<SubjectEntity> {
    return await this.findSubjectByIdOrFail(subjectId);
  }

  /// Crea una nueva asignatura después de verificar que el código es único
  async create(createDto: CreateSubjectDto): Promise<SubjectEntity> {
    // Verificar que el código de la asignatura sea único
    await this.ensureSubjectCodeIsUnique(createDto.subjectCode);

    // Verificar que el departamento exista
    const department = await this.validateDepartment(createDto.departmentId);

    // Verificar que los cursos existan
    const courses = await this.validateCourses(createDto.courseIds);

    // Crear la nueva asignatura
    const subject = new SubjectEntity();
    subject.subjectCode = createDto.subjectCode;
    subject.name = createDto.name;
    subject.department = department;
    subject.isActive = true;
    subject.courses = courses;

    // Guarda en la base de datos
    try {
      return await this.subjectRepository.save(subject);
    } catch (error) {
      throw new ConflictException(`Subject with code ${createDto.subjectCode} could not be created`);
    }
  }

  /// Actualiza una asignatura existente
  async update(subjectId: number, updateDto: UpdateSubjectDto): Promise<SubjectEntity> {
    const subject = await this.findSubjectByIdOrFail(subjectId);

    // Si se quiere cambiar el código, verificar unicidad
    if (updateDto.subjectCode && updateDto.subjectCode !== subject.subjectCode) {
      await this.ensureSubjectCodeIsUnique(updateDto.subjectCode);
      subject.subjectCode = updateDto.subjectCode;
    }

    // Actualizar otros campos si vienen en el DTO
    if (updateDto.name !== undefined) {
      subject.name = updateDto.name;
    }

    if (updateDto.departmentId !== undefined) {
      // Verifica que el departamento existaateDto.departmentId);
      const department = await this.validateDepartment(updateDto.departmentId);
      subject.department = department;
    }

    // Si se quieren cambiar los cursos
    if (updateDto.courseIds !== undefined) {
      // Verifica que los cursos existan
      const courses = await this.validateCourses(updateDto.courseIds);
      subject.courses = courses;
    }

    if (updateDto.isActive !== undefined) {
      subject.isActive = updateDto.isActive;
    }

    try {
      return await this.subjectRepository.save(subject);
    } catch (error) {
      throw new ConflictException(`Subject with code ${updateDto.subjectCode} could not be updated`);
    }
  }

  /// Desactiva una asignatura (soft delete)
  async softRemove(subjectId: number): Promise<void> {
    const subject = await this.findActiveSubjectByIdOrFail(subjectId);
    subject.isActive = false;
    await this.subjectRepository.save(subject);
  }

  //? ================= Métodos auxiliares =================

  //? Busca una asignatura por ID o lanza una excepción si no se encuentra
  private async findSubjectByIdOrFail(subjectId: number): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOneById(subjectId);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }
    return subject;
  }

  //? Busca una asignatura activa por ID o lanza una excepción si no se encuentra
  private async findActiveSubjectByIdOrFail(subjectId: number): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findOneActiveById(subjectId);
    if (!subject) {
      throw new NotFoundException(`Active subject with ID ${subjectId} not found`);
    }
    return subject;
  }

  //? Verifica que el código de la asignatura sea único
  private async ensureSubjectCodeIsUnique(subjectCode: string): Promise<void> {
    const existing = await this.subjectRepository.findOneBySubjectCode(subjectCode);
    if (existing) {
      throw new ConflictException(`Subject with code ${subjectCode} already exists`);
    }
  }

  //? Valida que el departamento exista
  private async validateDepartment(departmentId: number): Promise<DepartmentEntity> {
    return await this.departmentService.findOne(departmentId);
  }

  //? Valida que todos los cursos existan
  private async validateCourses(courseIds: number[]): Promise<CourseEntity[]> {
    if (!courseIds || courseIds.length === 0) {
      throw new ConflictException('At least one course must be assigned');
    }

    const courses = await Promise.all(
      courseIds.map(id => this.courseService.findOne(id))
    );

    return courses;
  }
}
