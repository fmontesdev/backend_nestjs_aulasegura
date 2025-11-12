import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from './domain/entities/subject.entity';
import { SubjectRepository } from './domain/repositories/subject.repository';
import { TypeOrmSubjectRepository } from './infrastructure/persistence/typeorm/typeorm-subject.repository';
import { SubjectService } from './application/services/subject.service';
import { SubjectController } from './presentation/controllers/subject.controller';
import { CourseModule } from '../courses/course.module';
import { DepartmentModule } from '../departments/department.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubjectEntity]),
    CourseModule,
    forwardRef(() => DepartmentModule), // Resuelve la dependencia circular
  ],
  controllers: [SubjectController],
  providers: [
    SubjectService,
    {
      provide: SubjectRepository,
      useClass: TypeOrmSubjectRepository,
    },
  ],
  exports: [SubjectService],
})
export class SubjectModule {}
