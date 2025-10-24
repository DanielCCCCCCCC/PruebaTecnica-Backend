// src/drivers/dto/filter-drivers.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class FilterDriversDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  licencia?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
