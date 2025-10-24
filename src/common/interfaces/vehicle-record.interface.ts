// common/interfaces/vehicle-record.interface.ts
import { RecordType } from '../enums/record-type.enum';
import { IVehicle } from './vehicle.interface';

export interface IVehicleRecord {
  id?: string;
  vehicleId: string;
  vehicle?: IVehicle;
  motorista: string;
  fecha: Date;
  hora: string;
  kilometraje: number;
  tipo: RecordType;
  createdAt?: Date;
}
