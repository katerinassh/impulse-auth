import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertWords1706126965239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS words (
          id SERIAL PRIMARY KEY UNIQUE,
          uaName varchar(50) UNIQUE NOT NULL,
          enName varchar(50) UNIQUE NOT NULL,
          espName varchar(50) UNIQUE NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          updated_at TIMESTAMP NOT NULL DEFAULT now()
        );
      INSERT INTO words(uaName, enName, espName)
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
      await queryRunner.query(`DROP TABLE words;`);
    }

}
