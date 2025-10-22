// src/vehicles/entities/vehicle.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { VehicleRecord } from '../../records/entities/vehicle-record.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  marca: string;

  @Column({ type: 'varchar', length: 100 })
  modelo: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  placa: string;

  @OneToMany(() => VehicleRecord, (record) => record.vehicle)
  records: VehicleRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
