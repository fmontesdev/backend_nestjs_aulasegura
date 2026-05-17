import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TeacherSubjectCourseEntity } from '../../domain/entities/teacher-subject-course.entity';
import { TeacherAssignmentsRepository } from '../../domain/repositories/teacher-assignments.repository';
import { CreateTeacherAssignmentDto } from '../dto/create-teacher-assignment.dto';
import { FindTeacherAssignmentsFiltersDto, PaginatedResult } from '../dto/find-teacher-assignments-filters.dto';
import { TeacherAssignmentResponseDto } from '../dto/teacher-assignment-response.dto';

@Injectable()
export class TeacherAssignmentsService {
  constructor(private readonly assignmentsRepo: TeacherAssignmentsRepository) {}

  async findAllWithFilters(filters: FindTeacherAssignmentsFiltersDto): Promise<PaginatedResult<TeacherAssignmentResponseDto>> {
    const result = await this.assignmentsRepo.findAllWithFilters(filters);

    return {
      data: result.data.map((assignment) => this.toResponse(assignment)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async findByTeacherId(teacherId: string): Promise<TeacherAssignmentResponseDto[]> {
    await this.findTeacherOrFail(teacherId);
    const assignments = await this.assignmentsRepo.findByTeacherId(teacherId);
    return assignments.map((assignment) => this.toResponse(assignment));
  }

  async create(dto: CreateTeacherAssignmentDto): Promise<TeacherAssignmentResponseDto> {
    const teacher = await this.findTeacherOrFail(dto.teacherId);
    const course = await this.assignmentsRepo.findCourseById(dto.courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${dto.courseId} not found`);
    }

    const subject = await this.assignmentsRepo.findSubjectById(dto.subjectId);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${dto.subjectId} not found`);
    }

    const existsCourseSubject = await this.assignmentsRepo.existsCourseSubject(dto.courseId, dto.subjectId);
    if (!existsCourseSubject) {
      throw new ConflictException(`Subject with ID ${dto.subjectId} is not assigned to course with ID ${dto.courseId}`);
    }

    const existing = await this.assignmentsRepo.findOne(dto.teacherId, dto.courseId, dto.subjectId);
    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('Teacher assignment already exists');
      }

      existing.isActive = true;
      const saved = await this.assignmentsRepo.save(existing);
      saved.teacher = teacher;
      saved.course = course;
      saved.subject = subject;

      return this.toResponse(saved);
    }

    const assignment = new TeacherSubjectCourseEntity();
    assignment.userId = dto.teacherId;
    assignment.teacher = teacher;
    assignment.courseId = dto.courseId;
    assignment.course = course;
    assignment.subjectId = dto.subjectId;
    assignment.subject = subject;
    assignment.isActive = true;

    const saved = await this.assignmentsRepo.save(assignment);
    saved.teacher = teacher;
    saved.course = course;
    saved.subject = subject;

    return this.toResponse(saved);
  }

  async delete(teacherId: string, courseId: number, subjectId: number): Promise<void> {
    await this.findTeacherOrFail(teacherId);
    const assignment = await this.assignmentsRepo.findOne(teacherId, courseId, subjectId);
    if (!assignment) {
      throw new NotFoundException('Teacher assignment not found');
    }

    await this.assignmentsRepo.softDelete(teacherId, courseId, subjectId);
  }

  private async findTeacherOrFail(teacherId: string) {
    const teacher = await this.assignmentsRepo.findTeacherByUserId(teacherId);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    return teacher;
  }

  private toResponse(assignment: TeacherSubjectCourseEntity): TeacherAssignmentResponseDto {
    return {
      teacher: {
        userId: assignment.teacher.userId,
        name: assignment.teacher.user.name,
        lastname: assignment.teacher.user.lastname,
        email: assignment.teacher.user.email,
      },
      course: {
        courseId: assignment.course.courseId,
        courseCode: assignment.course.courseCode,
        name: assignment.course.name,
      },
      subject: {
        subjectId: assignment.subject.subjectId,
        subjectCode: assignment.subject.subjectCode,
        name: assignment.subject.name,
      },
      createdAt: assignment.createdAt,
      isActive: assignment.isActive,
    };
  }
}
