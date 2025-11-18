import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { TeacherEntity } from '../../domain/entities/teacher.entity';
import { RoleName } from '../../domain/enums/rolename.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { hash as bcryptHash } from '@node-rs/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
  ) {}

  /// Obtiene todos los usuarios
  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepo.findAll();
  }

  /// Obtiene un usuario por su ID
  async findOne(userId: string): Promise<UserEntity> {
    return this.findUserByIdOrFail(userId);
  }

  /// Registra un nuevo usuario con rol y departamento (si es teacher)
  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    // Validaciones
    await this.ensureEmailIsUnique(dto.email);
    this.validateTeacherDepartment(dto.roleName, dto.departmentId);

    // Hash de la contraseña
    const passwordHash = await this.hashPassword(dto.password);

    // Crea usuario
    const user = new UserEntity();
    user.name = dto.name;
    user.lastname = dto.lastname;
    user.email = dto.email;
    user.passwordHash = passwordHash;
    user.avatar = dto.avatar || null;
    user.validFrom = new Date();
    user.validTo = null;
    user.createdAt = new Date();
    user.tokenVersion = 1;

    // Asigna rol
    const role = await this.findRoleByNameOrFail(dto.roleName);
    user.roles = [role];

    // Guarda usuario
    const savedUser = await this.saveUser(user);

    // Si es teacher, crea la entrada en teacher
    if (dto.roleName === RoleName.TEACHER && dto.departmentId) {
      const teacher = new TeacherEntity();
      teacher.userId = savedUser.userId;
      teacher.departmentId = dto.departmentId;
      
      await this.usersRepo.saveTeacher(teacher);
      
      // Recarga usuario con la relación teacher
      const userWithTeacher = await this.usersRepo.findOneById(savedUser.userId);
      return userWithTeacher!;
    }

    return savedUser;
  }

  /// Guarda los cambios de un usuario
  async saveUser(user: UserEntity): Promise<UserEntity> {
    return await this.usersRepo.save(user);
  }

  /// Actualiza un usuario existente
  async update(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
    // Verifica que el usuario exista
    const user = await this.findUserByIdOrFail(userId);

    // Si cambia el email, comprueba unicidad
    if (dto.email) {
      await this.ensureEmailIsUniqueForUpdate(dto.email, userId);
    }

    // Asignamos campos permitidos
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.lastname !== undefined) user.lastname = dto.lastname;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.password !== undefined) user.passwordHash = await this.hashPassword(dto.password);
    if (dto.avatar !== undefined) user.avatar = dto.avatar ?? null;
    if (dto.validTo !== undefined) user.validTo = dto.validTo ? new Date(dto.validTo) : null;

    return await this.saveUser(user);
  }

  /// Elimina un usuario de la base de datos
  async remove(userId: string): Promise<void> {
    // Verifica que el usuario exista
    await this.findUserByIdOrFail(userId);

    try {
      await this.usersRepo.deleteById(userId);
    } catch (e: any) {
      // MariaDB/MySQL: fila referenciada por FKs
      if (e?.errno === 1451 || /a foreign key constraint fails/i.test(e?.message)) {
        throw new ConflictException(
          'Cannot delete the user because it is referenced by other records'
        );
      }
      throw new BadRequestException('Could not delete the user');
    }
  }

  //? ================= Métodos auxiliares =================

  //? Busca un usuario por ID o lanza NotFoundException
  async findUserByIdOrFail(userId: string): Promise<UserEntity> {
    const user = await this.usersRepo.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //? Busca un usuario por email o lanza NotFoundException
  async findUserByEmailOrFail(email: string): Promise<UserEntity> {
    const user = await this.usersRepo.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //? Busca un usuario por email sin lanzar excepción
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepo.findOneByEmail(email);
  }

  //? Verifica que el email no esté en uso
  private async ensureEmailIsUnique(email: string): Promise<void> {
    const existingUser = await this.usersRepo.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }
  }

  //? Verifica que el email no esté en uso por otro usuario
  private async ensureEmailIsUniqueForUpdate(email: string, currentUserId: string): Promise<void> {
    const existingUser = await this.usersRepo.findOneByEmail(email);
    if (existingUser && existingUser.userId !== currentUserId) {
      throw new ConflictException('Email is already registered by another user');
    }
  }

  //? Busca un rol por nombre o lanza BadRequestException
  private async findRoleByNameOrFail(roleName: RoleName): Promise<any> {
    const role = await this.usersRepo.findRoleByName(roleName);
    if (!role) {
      throw new BadRequestException(`Role "${roleName}" not found in the database`);
    }
    return role;
  }

  //? Valida que si es teacher, tenga departmentId
  private validateTeacherDepartment(roleName: RoleName, departmentId?: number): void {
    if (roleName === RoleName.TEACHER && !departmentId) {
      throw new BadRequestException('The departmentId is required for teachers');
    }
  }

  //? Hash de contraseña con bcrypt
  private async hashPassword(password: string): Promise<string> {
    return bcryptHash(password, 12);
  }
}
