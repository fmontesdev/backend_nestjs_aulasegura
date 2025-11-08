import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AcademicYearModule } from './academic-year/academic-year.module';
import { CourseModule } from './courses/course.module';
import { SubjectModule } from './subjects/subject.module';
import { DepartmentEntity } from './entities/department.entity';
import { RoomEntity } from './entities/room.entity';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'user'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_DATABASE', 'db'),
        entities: [
          DepartmentEntity, RoomEntity,
          ScheduleEntity, WeeklyScheduleEntity, EventScheduleEntity, TagEntity,
          NotificationEntity, PermissionEntity, ReaderEntity, AccessLogEntity
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Solo en desarrollo
        autoLoadEntities: true, // Carga automáticamente las entidades
      }),
    }),
    UsersModule,
    AuthModule,
    AcademicYearModule,
    CourseModule,
    SubjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

