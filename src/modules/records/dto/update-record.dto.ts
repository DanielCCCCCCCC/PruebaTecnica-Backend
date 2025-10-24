import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordDto } from './create-record.dto';

// PartialType hace que todos los campos de CreateRecordDto sean opcionales.
export class UpdateRecordDto extends PartialType(CreateRecordDto) {}
