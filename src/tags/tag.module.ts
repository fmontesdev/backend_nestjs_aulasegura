import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TagEntity } from './domain/entities/tag.entity';
import { TagRepository } from './domain/repositories/tag.repository';
import { TypeOrmTagRepository } from './infrastructure/persistence/typeorm/typeorm-tag.repository';
import { TagService } from './application/services/tag.service';
import { TagController } from './presentation/controllers/tag.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagEntity]),
    ConfigModule,
    UsersModule,
  ],
  controllers: [TagController],
  providers: [
    TagService,
    {
      provide: TagRepository,
      useClass: TypeOrmTagRepository,
    },
  ],
  exports: [TagService],
})
export class TagModule {}
