// src/records/dto/create-record.dto.ts
import { RecordType } from '../../../common/enums/record-type.enum';

export class CreateRecordDto {
  vehicleId: number;
  motorista: string;
  fecha: Date;
  hora: string;
  kilometraje: number;
  tipo: RecordType;
}
