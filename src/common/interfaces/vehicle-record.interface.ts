// common/interfaces/vehicle-record.interface.ts
import { RecordType } from '../enums/record-type.enum';
import { IVehicle } from './vehicle.interface';

export interface IVehicleRecord {
  id?: number;
  vehicleId: number;
  vehicle?: IVehicle;
  motorista: string;
  fecha: Date;
  hora: string;
  kilometraje: number;
  tipo: RecordType;
  createdAt?: Date;
}

// common/interfaces/filter-params.interface.ts
export interface IFilterParams {
  fecha?: Date;
  vehicleId?: number;
  motorista?: string;
  startDate?: Date;
  endDate?: Date;
}
