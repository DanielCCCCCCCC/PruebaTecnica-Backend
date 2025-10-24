// src/records/records.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsController } from './controllers/records.controller';
import { RecordsService } from './services/records.service';
import { VehicleRecord } from './entities/vehicle-record.entity';
import { VehiclesModule } from '../vehicle/vehicle.module';
import { DriversModule } from '../drivers/driver.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehicleRecord]),
    VehiclesModule,
    DriversModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
