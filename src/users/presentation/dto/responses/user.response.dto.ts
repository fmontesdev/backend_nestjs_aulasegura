import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleName } from '../../../domain/enums/rolename.enum';
import { DepartmentEntity } from 'src/departments/domain/entities/department.entity';

export class UserResponse {
  @ApiProperty({
    description: 'Identificador del usuario (UUID v4)',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId!: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  name!: string;

  @ApiProperty({ description: 'Apellidos del usuario' })
  lastname!: string;

  @ApiProperty({ format: 'email', description: 'Email del usuario' })
  email!: string;

  @ApiPropertyOptional({ nullable: true, description: 'Archivo de imagen del avatar o null' })
  avatar!: string | null;

  @ApiProperty({ 
    description: 'Roles del usuario',
    enum: RoleName,
    isArray: true,
    example: [RoleName.TEACHER] 
  })
  roles!: RoleName[];

  @ApiProperty({
    description: 'Fecha de inicio de validez en ISO 8601',
    example: '2025-12-31T23:59:59.000Z',
    type: String,
    format: 'date-time',
  })
  validFrom!: Date;

  @ApiPropertyOptional({
    description: 'Fecha final de validez en ISO 8601 o null',
    example: '2025-12-31T23:59:59.000Z',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  validTo!: Date | null;

  @ApiProperty({
    description: 'Fecha de creación en ISO 8601',
    example: '2025-12-31T23:59:59.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiPropertyOptional({
    description: 'Departamento al que pertenece el usuario (solo para teachers)',
    type: () => DepartmentEntity,
    nullable: true,
  })
  department!: DepartmentEntity | null;
}
