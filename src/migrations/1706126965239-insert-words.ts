import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertWords1706126965239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS public.words (
          id SERIAL PRIMARY KEY UNIQUE,
          "uaName" varchar(50),
          "enName" varchar(50),
          "espName" varchar(50),
          "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
          "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
        );
      INSERT INTO public.words("uaName", "enName", "espName")
      VALUES
        ('Привіт', 'Hello', 'Hola'),
        ('Ти', 'You', 'Tú'),
        ('кохати', 'love', 'amar'),
        ('програміст', 'programmer', 'programador'),
        ('мова', 'language', 'idoma');
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM words
      WHERE "uaName" IN ('Привіт', 'Ти', 'кохати', 'програміст', 'мова');`);
  }
}
