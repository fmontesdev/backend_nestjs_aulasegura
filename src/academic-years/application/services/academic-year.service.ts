import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { AcademicYearEntity } from '../../domain/entities/academic-year.entity';
import { AcademicYearRepository } from '../../domain/repositories/academic-year.repository';
import { CreateAcademicYearDto } from '../dto/create-academic-year.dto';

@Injectable()
export class AcademicYearService {
  constructor(
    private readonly academicYearRepository: AcademicYearRepository,
  ) {}

  /// Busca todos los años académicos activos
  async findAll(): Promise<AcademicYearEntity[]> {
    return await this.academicYearRepository.findAll();
  }

  /// Busca un año académico por ID o lanza una excepción si no se encuentra
  async findOne(academicYearId: number): Promise<AcademicYearEntity> {
    return await this.findAcademicYearByIdOrFail(academicYearId);
  }

  /// Busca un año académico por código o lanza una excepción si no se encuentra
  async findByCode(code: string): Promise<AcademicYearEntity> {
    return await this.findAcademicYearByCodeOrFail(code);
  }

  /// Crea un nuevo año académico después de verificar que el código es único
  async create(createDto: CreateAcademicYearDto): Promise<AcademicYearEntity> {
    // Verifica que en el código del año académico con formato YYYY-YYYY, el segundo año sea el primero + 1
    this.ensureFormatCode(createDto.code);

    // Verifica unicidad del código
    await this.ensureCodeIsUnique(createDto.code);

    // Crea el nuevo año académico
    const academicYear = new AcademicYearEntity();
    academicYear.code = createDto.code;
    academicYear.isActive = true;

    // Guarda en la base de datos
    try {
      return await this.academicYearRepository.save(academicYear);
    } catch (error) {
      throw new ConflictException(`Academic year with code ${createDto.code} could not be created`);
    }
  }

  /// Desactiva un año académico (soft delete)
  async softRemove(academicYearId: number): Promise<void> {
    const academicYear = await this.findActiveAcademicYear();
    academicYear.isActive = false;
    await this.academicYearRepository.save(academicYear);
  }

  //? ================= Métodos auxiliares =================

  //? Busca un año académico por ID o lanza una excepción si no se encuentra
  private async findAcademicYearByIdOrFail(academicYearId: number): Promise<AcademicYearEntity> {
    const academicYear = await this.academicYearRepository.findOneById(academicYearId);
    if (!academicYear) {
      throw new NotFoundException(`Academic year with ID ${academicYearId} not found`);
    }
    return academicYear;
  }

  //? Busca un año académico por código o lanza una excepción si no se encuentra
  private async findAcademicYearByCodeOrFail(code: string): Promise<AcademicYearEntity> {
    const academicYear = await this.academicYearRepository.findOneByCode(code);
    if (!academicYear) {
      throw new NotFoundException(`Academic year with code ${code} not found`);
    }
    if (!academicYear.isActive) {
      throw new NotFoundException(`Academic year with code ${code} is not active`);
    }
    return academicYear;
  }

  //? Busca el año académico activo o lanza una excepción
  async findActiveAcademicYear(): Promise<AcademicYearEntity> {
    const academicYear = await this.academicYearRepository.findActive();
    if (!academicYear) {
      throw new NotFoundException('No active academic year found');
    }
    return academicYear;
  }

  //? Verifica que el código del año académico sea único
  private async ensureCodeIsUnique(code: string): Promise<void> {
    const existing = await this.academicYearRepository.findOneByCode(code);
    if (existing) {
      throw new ConflictException(`Academic year with code ${code} already exists`);
    }
  }

  //? Verifica que en el código del año académico con formato YYYY-YYYY, el segundo año sea el primero + 1
  private ensureFormatCode(code: string): void {
    const [startStr, endStr] = code.split('-');
    const start = Number(startStr);
    const end = Number(endStr);

    if (end !== start + 1) {
      throw new BadRequestException('The second year must be the first + 1 (e.g., 2024-2025)');
    }
  }
}
