import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { TeacherEntity } from '../../domain/entities/teacher.entity';
import { RoleName } from '../../domain/enums/rolename.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UploadAvatarDto } from '../dto/upload-avatar.dto';
import { FindUsersFiltersDto, PaginatedResult } from '../dto/find-users-filters.dto';
import { hash as bcryptHash } from '@node-rs/bcrypt';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  /// Obtiene usuarios con paginación y filtros
  async findAllWithFilters(filters: FindUsersFiltersDto): Promise<PaginatedResult<UserEntity>> {
    return await this.usersRepo.findAllWithFilters(filters);
  }

  /// Obtiene un usuario por su ID
  async findOne(userId: string): Promise<UserEntity> {
    return this.findUserByIdOrFail(userId);
  }

  /// Registra un nuevo usuario con rol y departamento (si es teacher)
  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    // Validaciones
    await this.ensureEmailIsUnique(dto.email);
    this.validateTeacherDepartment(dto.roles, dto.departmentId);

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
    user.validTo = dto.validTo || null;
    user.createdAt = new Date();
    user.tokenVersion = 1;

    // Asigna roles
    const roles = await Promise.all(
      dto.roles.map(roleName => this.findRoleByNameOrFail(roleName))
    );
    user.roles = roles;

    // Guarda usuario
    const savedUser = await this.saveUser(user);

    // Si es teacher, crea la entrada en teacher
    if (dto.roles.includes(RoleName.TEACHER) && dto.departmentId) {
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
    
    // Manejar actualización del avatar
    if (dto.avatar !== undefined) {
      const oldAvatar = user.avatar;
      const newAvatar = dto.avatar;
      
      // Si cambia el avatar y el antiguo era un archivo subido (no predefinido), eliminarlo
      if (oldAvatar && newAvatar !== oldAvatar && !this.isDefaultAvatar(oldAvatar)) {
        await this.deleteAvatarFile(oldAvatar);
      }
      
      user.avatar = newAvatar ?? null;
    }
    
    if (dto.validTo !== undefined) user.validTo = dto.validTo ? new Date(dto.validTo) : null;

    // Si se proporcionan roles, actualizarlos
    if (dto.roles !== undefined && dto.roles.length > 0) {
      const roles = await Promise.all(
        dto.roles.map(roleName => this.findRoleByNameOrFail(roleName))
      );
      user.roles = roles;
    }

    // Guardar usuario
    await this.saveUser(user);

    // Gestionar registro de teacher según los roles
    const isTeacher = user.roles?.some(role => role.name === RoleName.TEACHER);
    const teacher = await this.usersRepo.findTeacherByUserId(userId);

    if (isTeacher && dto.departmentId !== undefined) {
      // Usuario es teacher y se proporciona departmentId: actualizar o crear
      await this.updateOrCreateTeacherDepartment(userId, dto.departmentId);
    } else if (!isTeacher && teacher) {
      // Usuario ya no es teacher pero tiene registro: eliminar
      await this.usersRepo.deleteTeacher(userId);
    }

    // Recarga y retorna usuario con relaciones actualizadas
    const finalUser = await this.usersRepo.findOneById(userId);
    return finalUser!;
  }

  /// Elimina un usuario de la base de datos
  async remove(userId: string): Promise<void> {
    // Verifica que el usuario exista
    const user = await this.findUserByIdOrFail(userId);

    // Eliminar avatar si existe y no es predefinido
    if (user.avatar && !this.isDefaultAvatar(user.avatar)) {
      await this.deleteAvatarFile(user.avatar);
    }

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

  /// Sube el avatar de un usuario
  async uploadAvatar(userId: string, file: Express.Multer.File, dto: UploadAvatarDto): Promise<UserEntity> {
    // Verifica que el usuario exista
    const user = await this.findUserByIdOrFail(userId);

    const imagesPath = this.configService.get<string>('IMAGES_PATH', '/app/images');

    try {
      // Eliminar avatar anterior si existe y NO es predefinido
      if (user.avatar && !this.isDefaultAvatar(user.avatar)) {
        const oldAvatarPath = join(imagesPath, user.avatar);
        try {
          // Elimina el archivo antiguo del sistema de archivos
          await unlink(oldAvatarPath);
        } catch (error) {
          // Ignorar si el archivo no existe
          console.warn(`Could not delete old avatar: ${oldAvatarPath}`);
        }
      }

      // Renombrar el archivo temporal al nombre deseado
      const tempPath = file.path;  // app/images/temp_1234567890.jpg
      const finalPath = join(imagesPath, dto.filename);  // app/images/avatar_123.jpg
      
      // Usar rename para mover/renombrar el archivo
      const { rename } = await import('fs/promises');
      await rename(tempPath, finalPath);

      // Actualizar en BD el avatar del usuario con el nombre final
      user.avatar = dto.filename;
      const updatedUser = await this.saveUser(user);

      return updatedUser;
    } catch (error) {
      // Si algo falla, eliminar el archivo subido (puede ser temporal o ya renombrado)
      try {
        await unlink(file.path);
      } catch (e) {
        // Si el temporal ya fue renombrado, intentar eliminar el archivo final
        try {
          const finalPath = join(imagesPath, dto.filename);
          await unlink(finalPath);
        } catch (e2) {
          // Ignorar errores al eliminar
        }
      }

      throw new InternalServerErrorException('Failed to upload avatar');
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
  private validateTeacherDepartment(roleNames: RoleName[], departmentId?: number): void {
    if (roleNames.includes(RoleName.TEACHER) && !departmentId) {
      throw new BadRequestException('The departmentId is required for teachers');
    }
  }

  //? Actualiza o crea el registro de teacher con el departmentId
  private async updateOrCreateTeacherDepartment(userId: string, departmentId: number): Promise<void> {
    let teacher = await this.usersRepo.findTeacherByUserId(userId);

    if (teacher) {
      // Actualizar departamento existente
      teacher.departmentId = departmentId;
    } else {
      // Crear nuevo registro de teacher
      teacher = new TeacherEntity();
      teacher.userId = userId;
      teacher.departmentId = departmentId;
    }

    await this.usersRepo.saveTeacher(teacher);
  }

  //? Hash de contraseña con bcrypt
  private async hashPassword(password: string): Promise<string> {
    return bcryptHash(password, 12);
  }

  //? Verifica si el avatar es predefinido (formato: avatar_default_XX)
  private isDefaultAvatar(avatarFilename: string | null): boolean {
    if (!avatarFilename) return false;
    return avatarFilename.startsWith('avatar_default');
  }

  //? Elimina un archivo de avatar del sistema de archivos
  private async deleteAvatarFile(avatarFilename: string): Promise<void> {
    const imagesPath = this.configService.get<string>('IMAGES_PATH', '/app/images');
    const avatarPath = join(imagesPath, avatarFilename);
    
    try {
      await unlink(avatarPath);
    } catch (error) {
      // Ignorar si el archivo no existe
      console.warn(`Could not delete avatar file: ${avatarPath}`);
    }
  }
}
