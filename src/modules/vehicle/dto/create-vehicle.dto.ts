// src/vehicles/dto/create-vehicle.dto.ts
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  marca!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  modelo!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @Matches(/^[A-Z0-9-]+$/, {
    message: 'La placa debe contener solo letras mayúsculas, números y guiones',
  })
  placa: string;
}
