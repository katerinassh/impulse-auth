import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  providers: [WordService],
})
export class WordModule {}
