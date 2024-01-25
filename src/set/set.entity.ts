import { User } from 'src/user/user.entity';
import { Word } from 'src/word/word.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'sets' })
export class Set {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Word)
  @JoinTable()
  words: Word[];

  @ManyToOne(() => User, (user) => user.creator)
  @JoinColumn()
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
