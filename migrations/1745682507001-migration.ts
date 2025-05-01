import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1745682507001 implements MigrationInterface {
  name = 'Migration1745682507001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "url_shortener"."short_urls" (
        "id" uuid NOT NULL,
        "full_url" character varying NOT NULL,
        "short_code" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP NOT NULL,
        CONSTRAINT "UQ_short_code" UNIQUE ("short_code"),
        CONSTRAINT "pk_short_urls" PRIMARY KEY ("id")
      )`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_short_code" ON "url_shortener"."short_urls" ("short_code") `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "url_shortener"."idx_short_code"`)
    await queryRunner.query(`DROP TABLE "url_shortener"."short_urls"`)
  }
}
