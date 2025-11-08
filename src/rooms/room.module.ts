import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './domain/entities/room.entity';
import { RoomRepository } from './domain/repositories/room.repository';
import { TypeOrmRoomRepository } from './infrastructure/persistence/typeorm/typeorm-room.repository';
import { RoomService } from './application/services/room.service';
import { RoomController } from './presentation/controllers/room.controller';
import { CourseModule } from '../courses/course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity]),
    forwardRef(() => CourseModule),
  ],
  controllers: [RoomController],
  providers: [
    RoomService,
    {
      provide: RoomRepository,
      useClass: TypeOrmRoomRepository,
    },
  ],
  exports: [RoomService],
})
export class RoomModule {}
