import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEntity } from './domain/entities/department.entity';
import { DepartmentRepository } from './domain/repositories/department.repository';
import { TypeOrmDepartmentRepository } from './infrastructure/persistence/typeorm/typeorm-department.repository';
import { DepartmentService } from './application/services/department.service';
import { DepartmentController } from './presentation/controllers/department.controller';
import { SubjectModule } from '../subjects/subject.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepartmentEntity]),
    forwardRef(() => SubjectModule), // Resuelve la dependencia circular
    UsersModule,
  ],
  controllers: [DepartmentController],
  providers: [
    DepartmentService,
    {
      provide: DepartmentRepository,
      useClass: TypeOrmDepartmentRepository,
    },
  ],
  exports: [DepartmentService],
})
export class DepartmentModule {}
