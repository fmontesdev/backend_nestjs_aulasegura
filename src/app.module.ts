import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AcademicYearModule } from './academic-years/academic-year.module';
import { CourseModule } from './courses/course.module';
import { SubjectModule } from './subjects/subject.module';
import { DepartmentModule } from './departments/department.module';
import { TagModule } from './tags/tag.module';
import { RoomModule } from './rooms/room.module';
import { ReaderModule } from './readers/reader.module';
import { ScheduleModule } from './schedules/schedule.module';
import { PermissionModule } from './permissions/permission.module';
import { AccessModule } from './access/access.module';
import { NotificationEntity } from './entities/notification.entity';

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
          NotificationEntity,
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
    DepartmentModule,
    TagModule,
    RoomModule,
    ReaderModule,
    ScheduleModule,
    PermissionModule,
    AccessModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

