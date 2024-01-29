import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'refresh_sessions' })
export class RefreshSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  userId: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  refreshToken: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  fingerprint: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  ip: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  expiresIn: string;
}
