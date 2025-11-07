import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEntity } from '../../../domain/entities/course.entity';
import { CourseRepository } from '../../../domain/repositories/course.repository';

@Injectable()
export class TypeOrmCourseRepository implements CourseRepository {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly repository: Repository<CourseEntity>,
  ) {}

  async findAll(): Promise<CourseEntity[]> {
    return this.repository.find({
      where: { isActive: true, academicYears: {isActive: true} },
      relations: ['academicYears'],
      order: { courseId: 'ASC' },
    });
  }

  async findOneById(courseId: number): Promise<CourseEntity | null> {
    return this.repository.findOne({
      where: { courseId },
      relations: ['academicYears'],
    });
  }

  async findOneActiveById(courseId: number): Promise<CourseEntity | null> {
    return this.repository.findOne({
      where: { courseId, isActive: true, academicYears: {isActive: true} },
      relations: ['academicYears'],
    });
  }

  async findOneByCourseCode(courseCode: string): Promise<CourseEntity | null> {
    return this.repository.findOne({
      where: { courseCode },
    });
  }

  async save(course: CourseEntity): Promise<CourseEntity> {
    return this.repository.save(course);
  }
}
