import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AccessLogEntity } from './domain/entities/access-log.entity';
import { AccessLogRepository } from './domain/repositories/access-log.repository';
import { TypeOrmAccessLogRepository } from './infrastructure/persistence/typeorm/typeorm-access-log.repository';
import { AccessService } from './application/services/access.service';
import { AccessController } from './presentation/controllers/access.controller';
import { TagModule } from '../tags/tag.module';
import { ReaderModule } from '../readers/reader.module';
import { PermissionModule } from '../permissions/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessLogEntity]),
    ConfigModule,
    TagModule,
    ReaderModule,
    PermissionModule
  ],
  controllers: [AccessController],
  providers: [
    AccessService,
    {
      provide: AccessLogRepository,
      useClass: TypeOrmAccessLogRepository,
    },
  ],
  exports: [AccessService],
})
export class AccessModule {}
