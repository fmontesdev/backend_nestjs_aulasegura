import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './presentation/controllers/users.controller';
import { TeacherAssignmentsController } from './presentation/controllers/teacher-assignments.controller';
import { UsersService } from './application/services/users.service';
import { TeacherAssignmentsService } from './application/services/teacher-assignments.service';
import { UserEntity } from './domain/entities/user.entity';
import { TeacherEntity } from './domain/entities/teacher.entity';
import { TeacherSubjectCourseEntity } from './domain/entities/teacher-subject-course.entity';
import { RoleEntity } from './domain/entities/role.entity';
import { CourseEntity } from '../courses/domain/entities/course.entity';
import { SubjectEntity } from '../subjects/domain/entities/subject.entity';
import { UsersRepository } from './domain/repositories/users.repository';
import { TeacherAssignmentsRepository } from './domain/repositories/teacher-assignments.repository';
import { TypeormUsersRepository } from './Infraestructure/persistence/typeorm/typeorm-users.repository';
import { TypeormTeacherAssignmentsRepository } from './Infraestructure/persistence/typeorm/typeorm-teacher-assignments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TeacherEntity, TeacherSubjectCourseEntity, RoleEntity, CourseEntity, SubjectEntity])],
  controllers: [UsersController, TeacherAssignmentsController],
  providers: [
    UsersService,
    TeacherAssignmentsService,
    { provide: UsersRepository, useClass: TypeormUsersRepository }, // binding
    { provide: TeacherAssignmentsRepository, useClass: TypeormTeacherAssignmentsRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
