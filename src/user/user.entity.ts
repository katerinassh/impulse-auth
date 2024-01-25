import { Set } from 'src/set/set.entity';
import { Word } from 'src/word/word.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { RolesEnum } from './enum/roles.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => Word)
  @JoinTable()
  words: Word[];

  @ManyToOne(() => Set, (set: Set) => set.creator)
  creator: Set;

  @Column({ type: 'enum', enum: RolesEnum, nullable: false })
  role: RolesEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
