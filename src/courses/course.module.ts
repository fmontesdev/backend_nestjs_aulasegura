import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './domain/entities/course.entity';
import { CourseRepository } from './domain/repositories/course.repository';
import { TypeOrmCourseRepository } from './infrastructure/persistence/typeorm/typeorm-course.repository';
import { CourseService } from './application/services/course.service';
import { CourseController } from './presentation/controllers/course.controller';
import { AcademicYearModule } from '../academic-years/academic-year.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity]),
    AcademicYearModule,
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    {
      provide: CourseRepository,
      useClass: TypeOrmCourseRepository,
    },
  ],
  exports: [CourseService],
})
export class CourseModule {}
