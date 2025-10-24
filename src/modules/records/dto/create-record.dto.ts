// src/records/dto/create-record.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
  Min,
  IsEnum,
  IsUUID,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecordType } from '../../../common/enums/record-type.enum';

export class CreateRecordDto {
  @IsUUID()
  vehicleId: string;

  @IsUUID()
  driverId: string;

  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe tener el formato HH:MM',
  })
  hora: string;

  @IsNumber()
  @Min(0)
  kilometraje: number;

  @IsEnum(RecordType)
  tipo: RecordType;
}
