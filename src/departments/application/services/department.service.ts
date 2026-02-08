import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { DepartmentEntity } from '../../domain/entities/department.entity';
import { DepartmentRepository } from '../../domain/repositories/department.repository';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { FindDepartmentsFiltersDto } from '../dto/find-departments-filters.dto';
import { SubjectService } from '../../../subjects/application/services/subject.service';
import { UsersService } from '../../../users/application/services/users.service';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly departmentRepository: DepartmentRepository,
    @Inject(forwardRef(() => SubjectService)) // Resuelve la dependencia circular
    private readonly subjectService: SubjectService,
    private readonly usersService: UsersService,
  ) {}

  /// Busca todos los departamentos activos
  async findAll(): Promise<DepartmentEntity[]> {
    return await this.departmentRepository.findAll();
  }

  /// Busca departamentos con paginación y filtros
  async findAllWithFilters(filters: FindDepartmentsFiltersDto): Promise<{ data: DepartmentEntity[]; total: number }> {
    return await this.departmentRepository.findAllWithFilters(filters);
  }

  /// Busca un departamento por ID o lanza una excepción si no se encuentra
  async findOne(departmentId: number): Promise<DepartmentEntity> {
    return await this.findDepartmentByIdOrFail(departmentId);
  }

  /// Crea un nuevo departamento
  async create(createDto: CreateDepartmentDto): Promise<DepartmentEntity> {
    // Crear el nuevo departamento
    const department = new DepartmentEntity();
    department.name = createDto.name;
    department.isActive = true;

    // Guarda en la base de datos
    try {
      return await this.departmentRepository.save(department);
    } catch (error) {
      throw new ConflictException(`Department could not be created`);
    }
  }

  /// Actualiza un departamento existente
  async update(departmentId: number, updateDto: UpdateDepartmentDto): Promise<DepartmentEntity> {
    const department = await this.findDepartmentByIdOrFail(departmentId);

    // Actualizar campos si vienen en el DTO
    if (updateDto.name !== undefined) {
      department.name = updateDto.name;
    }

    if (updateDto.isActive !== undefined) {
      department.isActive = updateDto.isActive;
    }

    // Guarda en la base de datos
    try {
      return await this.departmentRepository.save(department);
    } catch (error) {
      throw new ConflictException(`Department with ID ${departmentId} could not be updated`);
    }
  }

  /// Desactiva un departamento (soft delete)
  async softRemove(departmentId: number): Promise<void> {
    const department = await this.findActiveDepartmentByIdOrFail(departmentId);
    department.isActive = false;
    await this.departmentRepository.save(department);
  }

  //? ================= Métodos auxiliares =================

  //? Busca un departamento por ID o lanza una excepción si no se encuentra
  private async findDepartmentByIdOrFail(departmentId: number): Promise<DepartmentEntity> {
    const department = await this.departmentRepository.findOneById(departmentId);
    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }
    return department;
  }

  //? Busca un departamento activo por ID o lanza una excepción si no se encuentra
  private async findActiveDepartmentByIdOrFail(departmentId: number): Promise<DepartmentEntity> {
    const department = await this.departmentRepository.findOneActiveById(departmentId);
    if (!department) {
      throw new NotFoundException(`Active department with ID ${departmentId} not found`);
    }
    return department;
  }
}
