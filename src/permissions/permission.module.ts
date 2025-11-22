import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './domain/entities/permission.entity';
import { ScheduleEntity } from '../schedules/domain/entities/schedule.entity';
import { WeeklyScheduleEntity } from '../schedules/domain/entities/weekly-schedule.entity';
import { EventScheduleEntity } from '../schedules/domain/entities/event-schedule.entity';
import { PermissionRepository } from './domain/repositories/permission.repository';
import { TypeOrmPermissionRepository } from './infrastructure/persistence/typeorm-permission.repository';
import { PermissionService } from './application/services/permission.service';
import { PermissionController } from './presentation/controllers/permission.controller';
import { UsersModule } from '../users/users.module';
import { RoomModule } from '../rooms/room.module';
import { AcademicYearModule } from '../academic-years/academic-year.module';
import { ScheduleModule } from '../schedules/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity, ScheduleEntity, WeeklyScheduleEntity, EventScheduleEntity]),
    UsersModule,
    forwardRef(() => RoomModule),
    AcademicYearModule,
    ScheduleModule,
  ],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    {
      provide: PermissionRepository,
      useClass: TypeOrmPermissionRepository,
    },
  ],
  exports: [PermissionService],
})
export class PermissionModule {}
