import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RecordsService } from '../services/records.service';
import { CreateRecordDto } from '../dto/create-record.dto';
import { FilterRecordsDto } from '../dto/filter-records.dto';
import { VehicleRecord } from '../entities/vehicle-record.entity';
import { UpdateRecordDto } from '../dto/update-record.dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  async create(
    @Body() createRecordDto: CreateRecordDto,
  ): Promise<VehicleRecord> {
    console.log('🟡 [CREATE] Received create request:', createRecordDto);

    try {
      const result = await this.recordsService.create(createRecordDto);
      console.log('✅ [CREATE] Record created successfully with relations:', {
        id: result.id,
        vehicle: result.vehicle
          ? `${result.vehicle.placa} (${result.vehicle.marca})`
          : 'NULL',
        driver: result.driver ? result.driver.nombre : 'NULL',
      });
      console.log('[Resultado de crear:]', result);
      return result;
    } catch (error) {
      console.error('🔴 [CREATE] Error creating record:', error);
      throw error;
    }
  }

  @Get('filters')
  async getFilterOptions(): Promise<{
    vehicles: { id: string; placa: string; marca: string; modelo: string }[];
    drivers: { id: string; nombre: string; licencia: string }[];
  }> {
    console.log('🔍 GET /records/filters called');
    try {
      const result = await this.recordsService.getFilterOptions();
      console.log(
        '✅ Filter options result - Vehicles:',
        result.vehicles.length,
      );
      console.log('✅ Filter options result - Drivers:', result.drivers.length);
      return result;
    } catch (error) {
      console.error('❌ Error in /records/filters:', error);
      console.error('❌ Error details:', {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        message: error.message,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        stack: error.stack,
      });
      return {
        vehicles: [],
        drivers: [],
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<VehicleRecord> {
    return this.recordsService.findOne(id);
  }

  @Get()
  async findAll(
    @Query() filterRecordsDto: FilterRecordsDto,
  ): Promise<VehicleRecord[]> {
    console.log('🟡 Controller received filters:', filterRecordsDto);
    return this.recordsService.findAll(filterRecordsDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ): Promise<VehicleRecord> {
    return this.recordsService.update(id, updateRecordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.recordsService.remove(id);
  }
}
