// src/records/records.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleRecord } from './entities/vehicle-record.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleRecord]), VehiclesModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
