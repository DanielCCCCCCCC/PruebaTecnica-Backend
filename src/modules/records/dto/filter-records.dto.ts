// src/module/records/dto/filter-records.dto.ts
import { IsDate, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { RecordType } from 'src/common/enums/record-type.enum';

export class FilterRecordsDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha?: Date;

  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @IsUUID()
  @IsOptional()
  driverId?: string;

  // --- NUEVA PROPIEDAD ---
  @IsEnum(RecordType)
  @IsOptional()
  tipo?: RecordType;
  // --- FIN NUEVA PROPIEDAD ---

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}
