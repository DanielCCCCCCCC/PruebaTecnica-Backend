// src/drivers/dto/create-driver.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @Matches(/^[A-Z0-9-]+$/, {
    message:
      'La licencia debe contener solo letras mayúsculas, números y guiones',
  })
  licencia: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  telefono?: string;

  @IsEmail()
  @IsOptional()
  @Length(1, 255)
  email?: string;
}
