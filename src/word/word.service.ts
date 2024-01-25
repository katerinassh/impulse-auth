import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Word } from './word.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WordService extends TypeOrmCrudService<Word> {
  constructor(
    @InjectRepository(Word)
    private repository: Repository<Word>,
  ) {
    super(repository);
  }
}
