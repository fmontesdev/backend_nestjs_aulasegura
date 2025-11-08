import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SubjectEntity } from '../../domain/entities/subject.entity';
import { SubjectRepository } from '../../domain/repositories/subject.repository';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { CourseService } from '../../../courses/application/services/course.service';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly courseService: CourseService,
  ) {}

  /// Busca todas las asignaturas activas
  async findAll(): Promise<SubjectEntity[]> {
    return await this.subjectRepository.findAll();
  }

  /// Busca una asignatura por ID o lanza una excepción si no se encuentra
  async findOne(subjectId: number): Promise<SubjectEntity> {
    return await this.findSubjectByIdOrFail(subjectId);
  }

  /// Crea una nueva asignatura después de verificar que el código es único
  async create(createDto: CreateSubjectDto): Promise<SubjectEntity> {
    // Verificar que el código de la asignatura sea único
    await this.ensureSubjectCodeIsUnique(createDto.subjectCode);

    // Verificar que los cursos existan
    const courses = await this.validateCourses(createDto.courseIds);

    // Crear la nueva asignatura
    const subject = new SubjectEntity();
    subject.subjectCode = createDto.subjectCode;
    subject.name = createDto.name;
    //! FALTA MÓDULO DE DEPARTAMENTOS PARA VALIDARLO
    subject.departmentId = createDto.departmentId;
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
      //! FALTA MÓDULO DE DEPARTAMENTOS PARA VALIDARLO
      subject.departmentId = updateDto.departmentId;
    }

    // Si se quieren cambiar los cursos
    if (updateDto.courseIds !== undefined) {
      const courses = await this.validateCourses(updateDto.courseIds);
      subject.courses = courses;
    }

    return await this.subjectRepository.save(subject);
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

  //? Valida que todos los cursos existan
  private async validateCourses(courseIds: number[]): Promise<any[]> {
    if (!courseIds || courseIds.length === 0) {
      throw new ConflictException('At least one course must be assigned');
    }

    const courses = await Promise.all(
      courseIds.map(id => this.courseService.findOne(id))
    );

    return courses;
  }
}
