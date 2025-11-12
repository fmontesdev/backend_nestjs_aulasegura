import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicYearEntity } from './domain/entities/academic-year.entity';
import { AcademicYearRepository } from './domain/repositories/academic-year.repository';
import { TypeOrmAcademicYearRepository } from './infrastructure/persistence/typeorm/typeorm-academic-year.repository';
import { AcademicYearService } from './application/services/academic-year.service';
import { AcademicYearController } from './presentation/controllers/academic-year.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicYearEntity])],
  controllers: [AcademicYearController],
  providers: [
    AcademicYearService,
    {
      provide: AcademicYearRepository,
      useClass: TypeOrmAcademicYearRepository,
    },
  ],
  exports: [AcademicYearService],
})
export class AcademicYearModule {}
