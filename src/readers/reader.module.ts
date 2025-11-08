import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReaderEntity } from './domain/entities/reader.entity';
import { ReaderRepository } from './domain/repositories/reader.repository';
import { TypeOrmReaderRepository } from './infrastructure/persistence/typeorm/typeorm-reader.repository';
import { ReaderService } from './application/services/reader.service';
import { ReaderController } from './presentation/controllers/reader.controller';
import { RoomModule } from '../rooms/room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReaderEntity]),
    forwardRef(() => RoomModule),
  ],
  controllers: [ReaderController],
  providers: [
    ReaderService,
    {
      provide: ReaderRepository,
      useClass: TypeOrmReaderRepository,
    },
  ],
  exports: [ReaderService],
})
export class ReaderModule {}
