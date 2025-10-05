import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DepartmentEntity } from './entities/department.entity';
import { SubjectEntity } from './entities/subject.entity';
import { CourseEntity } from './entities/course.entity';
import { RoomEntity } from './entities/room.entity';
import { AcademicYearEntity } from './entities/academic-year.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { WeeklyScheduleEntity } from './entities/weekly-schedule.entity';
import { EventScheduleEntity } from './entities/event-schedule.entity';
import { TagEntity } from './entities/tag.entity';
import { NotificationEntity } from './entities/notification.entity';
import { PermissionEntity } from './entities/permission.entity';
import { ReaderEntity } from './entities/reader.entity';
import { AccessLogEntity } from './entities/access-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        username: process.env.DB_USER || 'user',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'db',
        entities: [
          DepartmentEntity, SubjectEntity, CourseEntity, RoomEntity, AcademicYearEntity,
          ScheduleEntity, WeeklyScheduleEntity, EventScheduleEntity, TagEntity,
          NotificationEntity, PermissionEntity, ReaderEntity, AccessLogEntity
        ],
        synchronize: true, // Solo para desarrollo
        autoLoadEntities: true, // Carga automáticamente las entidades
      }),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

