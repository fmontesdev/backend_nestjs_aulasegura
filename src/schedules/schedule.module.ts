import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from './domain/entities/schedule.entity';
import { WeeklyScheduleEntity } from './domain/entities/weekly-schedule.entity';
import { EventScheduleEntity } from './domain/entities/event-schedule.entity';
import { ScheduleRepository } from './domain/repositories/schedule.repository';
import { WeeklyScheduleRepository } from './domain/repositories/weekly-schedule.repository';
import { EventScheduleRepository } from './domain/repositories/event-schedule.repository';
import { TypeOrmScheduleRepository } from './infrastructure/persistence/typeorm/typeorm-schedule.repository';
import { TypeOrmWeeklyScheduleRepository } from './infrastructure/persistence/typeorm/typeorm-weekly-schedule.repository';
import { TypeOrmEventScheduleRepository } from './infrastructure/persistence/typeorm/typeorm-event-schedule.repository';
import { ScheduleService } from './application/services/schedule.service';
import { WeeklyScheduleService } from './application/services/weekly-schedule.service';
import { EventScheduleService } from './application/services/event-schedule.service';
import { ScheduleController } from './presentation/controllers/schedule.controller';
import { WeeklyScheduleController } from './presentation/controllers/weekly-schedule.controller';
import { EventScheduleController } from './presentation/controllers/event-schedule.controller';
import { AcademicYearModule } from '../academic-years/academic-year.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleEntity, WeeklyScheduleEntity, EventScheduleEntity]),
    AcademicYearModule,
  ],
  controllers: [ScheduleController, WeeklyScheduleController, EventScheduleController],
  providers: [
    ScheduleService,
    WeeklyScheduleService,
    EventScheduleService,
    {
      provide: ScheduleRepository,
      useClass: TypeOrmScheduleRepository,
    },
    {
      provide: WeeklyScheduleRepository,
      useClass: TypeOrmWeeklyScheduleRepository,
    },
    {
      provide: EventScheduleRepository,
      useClass: TypeOrmEventScheduleRepository,
    },
  ],
  exports: [ScheduleService, WeeklyScheduleService, EventScheduleService],
})
export class ScheduleModule {}
