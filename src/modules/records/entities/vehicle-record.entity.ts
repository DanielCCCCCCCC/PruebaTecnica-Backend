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
import { RecordType } from 'src/common/enums/record-type.enum';

@Entity('vehicle_records')
export class VehicleRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.records)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ type: 'varchar', length: 150 })
  motorista: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  kilometraje: number;

  @Column({
    type: 'enum',
    enum: RecordType,
    enumName: 'record_type_enum',
  })
  tipo: RecordType;

  @CreateDateColumn()
  createdAt: Date;
}
