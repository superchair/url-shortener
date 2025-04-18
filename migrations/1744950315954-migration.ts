import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1744950315954 implements MigrationInterface {
  name = 'Migration1744950315954'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "url_shortener"."short_urls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phoneNumber" character varying(10) NOT NULL, CONSTRAINT "PK_0bee0ef97594699927c1b7c81a3" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "url_shortener"."short_urls"`)
  }
}
