import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { CreateUserInput } from '../dto/inputs/create-user.input';
import { UpdateUserInput } from '../dto/inputs/update-user.input';
import { UserOutput } from '../dto/outputs/user.output';
import { UserMapper } from '../mappers/user.mapper';
import { hash as bcryptHash } from '@node-rs/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepository,
  ) {}


  async findAll(): Promise<UserOutput[]> {
    const entities = await this.usersRepo.findAll();
    return UserMapper.toResponseList(entities);
  }

  async findOne(userId: string): Promise<UserOutput> {
    const entity = await this.usersRepo.findOneById(userId);
    if (!entity) throw new NotFoundException('Usuario no encontrado');
    return UserMapper.toResponse(entity);
  }


  async create(dto: CreateUserInput): Promise<UserOutput> {
    // Comprueba que el email sea único
    const exists = await this.usersRepo.findOneByEmail(dto.email);
    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashea la contraseña (@node-rs/bcrypt)
    const hashStr = await bcryptHash(dto.password, 12); // cost 12 recomendado
    
    // Crea la entidad
    const entity = this.usersRepo.create({
      name: dto.name,
      lastname: dto.lastname,
      email: dto.email,
      passwordHash: hashStr,
      avatar: dto.avatar ?? null,
      validTo: dto.validTo ? new Date(dto.validTo) : null,
    });

    const saved = await this.usersRepo.save(entity);
    return UserMapper.toResponse(saved);
  }


  async update(userId: string, dto: UpdateUserInput): Promise<UserOutput> {
    // Verifica que el usuario exista
    const user = await this.usersRepo.findOneById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Si cambia el email, comprueba unicidad
    if (dto.email) {
      const other = await this.usersRepo.findOneByEmail(dto.email);
      if (other && other.userId !== userId) {
        throw new ConflictException('El email ya está registrado por otro usuario');
      }
    }

    // Asignamos campos permitidos
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.lastname !== undefined) user.lastname = dto.lastname;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.password !== undefined) user.passwordHash = await bcryptHash(dto.password, 12);
    if (dto.avatar !== undefined) user.avatar = dto.avatar ?? null;
    if (dto.validTo !== undefined) user.validTo = dto.validTo ? new Date(dto.validTo) : null;

    const updated = await this.usersRepo.save(user);
    return UserMapper.toResponse(updated);
  }


  // Elimina un usuario de la base de datos
  async remove(userId: string): Promise<void> {
    // Verifica que el usuario exista
    const exists = await this.usersRepo.existsById(userId);
    if (!exists) throw new NotFoundException('Usuario no encontrado');

    try {
      await this.usersRepo.deleteById(userId);
    } catch (e: any) {
      // MariaDB/MySQL: fila referenciada por FKs
      if (e?.errno === 1451 || /a foreign key constraint fails/i.test(e?.message)) {
        throw new ConflictException(
          'No se puede eliminar el usuario porque está referenciado por otros registros. ' +
            'Revise permisos, tags, logs, etc. (o utilice baja lógica con valid_to).',
        );
      }
      throw new BadRequestException('No se pudo eliminar el usuario');
    }
  }


  // Desactiva usuario poniendo valid_to a fecha actual
  async softRemove(userId: string): Promise<UserOutput> {
    // Verifica que el usuario exista
    const user = await this.usersRepo.findOneById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.validTo = new Date();
    const updated = await this.usersRepo.save(user);
    return UserMapper.toResponse(updated);
  }
}
