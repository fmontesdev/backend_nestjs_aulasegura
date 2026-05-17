import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CourseEntity } from '../../../../courses/domain/entities/course.entity';
import { SubjectEntity } from '../../../../subjects/domain/entities/subject.entity';
import { FindTeacherAssignmentsFiltersDto, PaginatedResult } from '../../../application/dto/find-teacher-assignments-filters.dto';
import { TeacherEntity } from '../../../domain/entities/teacher.entity';
import { TeacherSubjectCourseEntity } from '../../../domain/entities/teacher-subject-course.entity';
import { TeacherAssignmentsRepository } from '../../../domain/repositories/teacher-assignments.repository';

@Injectable()
export class TypeormTeacherAssignmentsRepository implements TeacherAssignmentsRepository {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepo: Repository<SubjectEntity>,
    @InjectRepository(TeacherSubjectCourseEntity)
    private readonly assignmentRepo: Repository<TeacherSubjectCourseEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findTeacherByUserId(userId: string): Promise<TeacherEntity | null> {
    return this.teacherRepo.findOne({ where: { userId }, relations: ['user'] });
  }

  async findCourseById(courseId: number): Promise<CourseEntity | null> {
    return this.courseRepo.findOne({ where: { courseId } });
  }

  async findSubjectById(subjectId: number): Promise<SubjectEntity | null> {
    return this.subjectRepo.findOne({ where: { subjectId } });
  }

  async existsCourseSubject(courseId: number, subjectId: number): Promise<boolean> {
    const rows = await this.dataSource.query(
      'SELECT 1 FROM `course_subject` WHERE `course_id` = ? AND `subject_id` = ? LIMIT 1',
      [courseId, subjectId],
    );

    return rows.length > 0;
  }

  async findAllWithFilters(filters: FindTeacherAssignmentsFiltersDto): Promise<PaginatedResult<TeacherSubjectCourseEntity>> {
    const { page, limit, globalSearch, teacherId, teacher, email, course, courseId, subject, subjectId, isActive } = filters;
    const query = this.assignmentRepo
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .leftJoinAndSelect('assignment.course', 'course')
      .leftJoinAndSelect('assignment.subject', 'subject');

    if (globalSearch && globalSearch.length > 0) {
      const globalConditions: string[] = [];
      const globalParams: Record<string, string> = {};

      globalSearch.forEach((term, index) => {
        const paramName = `global${index}`;
        const numericParamName = `globalNumeric${index}`;
        const isNumericTerm = /^\d+$/.test(term.trim());
        globalConditions.push(`(
          LOWER(user.name) LIKE LOWER(:${paramName}) OR
          LOWER(user.lastname) LIKE LOWER(:${paramName}) OR
          LOWER(CONCAT(user.name, ' ', user.lastname)) LIKE LOWER(:${paramName}) OR
          LOWER(user.email) LIKE LOWER(:${paramName}) OR
          LOWER(course.courseCode) LIKE LOWER(:${paramName}) OR
          LOWER(course.name) LIKE LOWER(:${paramName}) OR
          LOWER(subject.subjectCode) LIKE LOWER(:${paramName}) OR
          LOWER(subject.name) LIKE LOWER(:${paramName})
          ${isNumericTerm ? `OR assignment.courseId = :${numericParamName} OR assignment.subjectId = :${numericParamName}` : ''}
        )`);
        globalParams[paramName] = `%${term}%`;
        if (isNumericTerm) {
          globalParams[numericParamName] = term.trim();
        }
      });

      query.andWhere(`(${globalConditions.join(' AND ')})`, globalParams);
    }

    if (teacherId) {
      query.andWhere('assignment.userId = :teacherId', { teacherId });
    }

    if (teacher) {
      query.andWhere(
        '(LOWER(user.name) LIKE LOWER(:teacher) OR LOWER(user.lastname) LIKE LOWER(:teacher) OR LOWER(CONCAT(user.name, \' \', user.lastname)) LIKE LOWER(:teacher) OR LOWER(user.email) LIKE LOWER(:teacher))',
        { teacher: `%${teacher}%` },
      );
    }

    if (email) {
      query.andWhere('LOWER(user.email) LIKE LOWER(:email)', { email: `%${email}%` });
    }

    if (course || courseId !== undefined) {
      query.andWhere(new Brackets((qb) => {
        if (course) {
          qb.where('(LOWER(course.courseCode) LIKE LOWER(:course) OR LOWER(course.name) LIKE LOWER(:course))', { course: `%${course}%` });
        }

        if (courseId !== undefined) {
          const method = course ? 'orWhere' : 'where';
          qb[method]('assignment.courseId = :courseId', { courseId });
        }
      }));
    }

    if (subject || subjectId !== undefined) {
      query.andWhere(new Brackets((qb) => {
        if (subject) {
          qb.where('(LOWER(subject.subjectCode) LIKE LOWER(:subject) OR LOWER(subject.name) LIKE LOWER(:subject))', { subject: `%${subject}%` });
        }

        if (subjectId !== undefined) {
          const method = subject ? 'orWhere' : 'where';
          qb[method]('assignment.subjectId = :subjectId', { subjectId });
        }
      }));
    }

    query.andWhere('assignment.isActive = :isActive', { isActive: isActive ?? true });

    const [data, total] = await query
      .orderBy('user.lastname', 'ASC')
      .addOrderBy('user.name', 'ASC')
      .addOrderBy('course.courseCode', 'ASC')
      .addOrderBy('subject.subjectCode', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByTeacherId(userId: string): Promise<TeacherSubjectCourseEntity[]> {
    return this.assignmentRepo.find({
      where: { userId, isActive: true },
      relations: ['teacher', 'teacher.user', 'course', 'subject'],
      order: { courseId: 'ASC', subjectId: 'ASC' },
    });
  }

  async findByAssignmentId(assignmentId: number): Promise<TeacherSubjectCourseEntity | null> {
    return this.assignmentRepo.findOne({
      where: { assignmentId },
      relations: ['teacher', 'teacher.user', 'course', 'subject'],
    });
  }

  async findOne(userId: string, courseId: number, subjectId: number): Promise<TeacherSubjectCourseEntity | null> {
    return this.assignmentRepo.findOne({
      where: { userId, courseId, subjectId },
      relations: ['teacher', 'teacher.user', 'course', 'subject'],
    });
  }

  async save(assignment: TeacherSubjectCourseEntity): Promise<TeacherSubjectCourseEntity> {
    return this.assignmentRepo.save(assignment);
  }

  async softDeleteByAssignmentId(assignmentId: number): Promise<void> {
    await this.assignmentRepo.update({ assignmentId }, { isActive: false });
  }
}
