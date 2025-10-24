import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1761264056406 implements MigrationInterface {
    name = 'InitialSchema1761264056406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "drivers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(150) NOT NULL, "licencia" character varying(20) NOT NULL, "telefono" character varying(20), "email" character varying(255), "activo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5741cb3a00c053f7f0e0e230ab4" UNIQUE ("licencia"), CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."vehicle_records_tipo_enum" AS ENUM('entrada', 'salida')`);
        await queryRunner.query(`CREATE TABLE "vehicle_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vehicleId" uuid NOT NULL, "driverId" uuid, "fecha" date NOT NULL, "hora" TIME NOT NULL, "kilometraje" numeric(10,2) NOT NULL, "tipo" "public"."vehicle_records_tipo_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f8152a3c5ee74c8eaec30e7149a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "marca" character varying(100) NOT NULL, "modelo" character varying(100) NOT NULL, "placa" character varying(20) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_00f176cfec58c116bac5a4a27ed" UNIQUE ("placa"), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vehicle_records" ADD CONSTRAINT "FK_b9cc9d3ccdc1a2706c8f5726e16" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vehicle_records" ADD CONSTRAINT "FK_c26b8450b7856a20e4fd2e6022b" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle_records" DROP CONSTRAINT "FK_c26b8450b7856a20e4fd2e6022b"`);
        await queryRunner.query(`ALTER TABLE "vehicle_records" DROP CONSTRAINT "FK_b9cc9d3ccdc1a2706c8f5726e16"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "vehicle_records"`);
        await queryRunner.query(`DROP TYPE "public"."vehicle_records_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "drivers"`);
    }

}
