import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'words' })
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uaName: string;

  @Column()
  enName: string;

  @Column()
  espName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
