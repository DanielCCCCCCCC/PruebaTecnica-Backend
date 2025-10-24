// src/records/entities/vehicle-record.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { RecordType } from '../../../common/enums/record-type.enum';

@Entity('vehicle_records')
export class VehicleRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.records, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column()
  vehicleId: string;

  @ManyToOne(() => Driver, (driver) => driver.records, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column({ nullable: true })
  driverId: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  kilometraje: number;

  @Column({
    type: 'enum',
    enum: RecordType,
  })
  tipo: RecordType;

  @CreateDateColumn()
  createdAt: Date;
}
