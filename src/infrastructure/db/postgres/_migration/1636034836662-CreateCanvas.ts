import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCanvas1636034836662 implements MigrationInterface {
    name = "CreateCanvas1636034836662"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `CREATE TABLE "canvas" (
            "id" character varying NOT NULL,
            "title" character varying NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_13gj4uq56td6ek28qhn4xbctxj4" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "canvas"`);
    }
}
