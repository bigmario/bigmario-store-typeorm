import { MigrationInterface, QueryRunner } from "typeorm";

export class manyToMany1665428691751 implements MigrationInterface {
    name = 'manyToMany1665428691751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_categories_category" ("productId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_17f2a361443184000ee8d79f240" PRIMARY KEY ("productId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_342d06dd0583aafc156e076379" ON "product_categories_category" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_15520e638eb4c46c4fb2c61c4b" ON "product_categories_category" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "order_products_categories_category" ("orderUserId" integer NOT NULL, "orderProductsId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_fb0bd3e3655f18ba35133b13c85" PRIMARY KEY ("orderUserId", "orderProductsId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0144b1a0d70f980b144a87ddec" ON "order_products_categories_category" ("orderUserId", "orderProductsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7476f0b2e1f51f1a65f4be6882" ON "order_products_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "category" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_342d06dd0583aafc156e0763790" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_products_categories_category" ADD CONSTRAINT "FK_0144b1a0d70f980b144a87ddec9" FOREIGN KEY ("orderUserId", "orderProductsId") REFERENCES "order"("userId","productsId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_products_categories_category" ADD CONSTRAINT "FK_7476f0b2e1f51f1a65f4be68828" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_products_categories_category" DROP CONSTRAINT "FK_7476f0b2e1f51f1a65f4be68828"`);
        await queryRunner.query(`ALTER TABLE "order_products_categories_category" DROP CONSTRAINT "FK_0144b1a0d70f980b144a87ddec9"`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4"`);
        await queryRunner.query(`ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_342d06dd0583aafc156e0763790"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7476f0b2e1f51f1a65f4be6882"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0144b1a0d70f980b144a87ddec"`);
        await queryRunner.query(`DROP TABLE "order_products_categories_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15520e638eb4c46c4fb2c61c4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_342d06dd0583aafc156e076379"`);
        await queryRunner.query(`DROP TABLE "product_categories_category"`);
    }

}
