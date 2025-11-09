import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleEntity } from './domain/entities/schedule.entity';
import { WeeklyScheduleEntity } from './domain/entities/weekly-schedule.entity';
import { EventScheduleEntity } from './domain/entities/event-schedule.entity';
import { WeeklyScheduleRepository } from './domain/repositories/weekly-schedule.repository';
import { TypeOrmWeeklyScheduleRepository } from './infrastructure/persistence/typeorm/typeorm-weekly-schedule.repository';
import { WeeklyScheduleService } from './application/services/weekly-schedule.service';
import { WeeklyScheduleController } from './presentation/controllers/weekly-schedule.controller';
import { AcademicYearModule } from '../academic-years/academic-year.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScheduleEntity, WeeklyScheduleEntity, EventScheduleEntity]),
    AcademicYearModule,
  ],
  controllers: [WeeklyScheduleController],
  providers: [
    WeeklyScheduleService,
    {
      provide: WeeklyScheduleRepository,
      useClass: TypeOrmWeeklyScheduleRepository,
    },
  ],
  exports: [WeeklyScheduleService],
})
export class ScheduleModule {}
