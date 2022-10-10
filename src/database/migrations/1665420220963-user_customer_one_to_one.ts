import { MigrationInterface, QueryRunner } from "typeorm";

export class userCustomerOneToOne1665420220963 implements MigrationInterface {
    name = 'userCustomerOneToOne1665420220963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "customerId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_6c687a8fa35b0ae35ce766b56ce" UNIQUE ("customerId")`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD "userCustomerid" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "UQ_3633e8efea10e6511719343d061" UNIQUE ("userCustomerid")`);
        await queryRunner.query(`ALTER TABLE "order" ADD "userCreatedat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" ADD "userUpdatedat" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_6c687a8fa35b0ae35ce766b56ce" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_3633e8efea10e6511719343d061" FOREIGN KEY ("userCustomerid") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_3633e8efea10e6511719343d061"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_6c687a8fa35b0ae35ce766b56ce"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userUpdatedat"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userCreatedat"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "UQ_3633e8efea10e6511719343d061"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userCustomerid"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_6c687a8fa35b0ae35ce766b56ce"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    }

}
