// src/records/services/records.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { VehicleRecord } from '../entities/vehicle-record.entity';
import { CreateRecordDto } from '../dto/create-record.dto';
import { FilterRecordsDto } from '../dto/filter-records.dto';
import { VehiclesService } from '../../vehicle/services/vehicles.service';
import { DriversService } from '../../drivers/services/drivers.service';
import { UpdateRecordDto } from '../dto/update-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RecordType } from 'src/common/enums/record-type.enum';
import { Driver } from 'src/modules/drivers/entities/driver.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(VehicleRecord)
    private readonly recordRepository: Repository<VehicleRecord>,
    private readonly vehiclesService: VehiclesService,
    private readonly driversService: DriversService,
  ) {}

  async findOne(id: string): Promise<VehicleRecord> {
    const record = await this.recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.vehicle', 'vehicle')
      .leftJoinAndSelect('record.driver', 'driver')
      .where('record.id = :id', { id })
      .getOne();

    if (!record) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }

    return record;
  }

  async create(createRecordDto: CreateRecordDto): Promise<VehicleRecord> {
    console.log(
      '🟡 [SERVICE CREATE] Processing create record:',
      createRecordDto,
    );

    try {
      // 1. Validar y cargar el vehículo COMPLETO
      const vehicle = await this.vehiclesService.findOne(
        createRecordDto.vehicleId,
      );
      if (!vehicle) {
        throw new NotFoundException(
          `Vehículo con ID ${createRecordDto.vehicleId} no encontrado`,
        );
      }

      // 2. Validar y cargar el conductor COMPLETO (si existe) - CORREGIDO
      let driver: Driver | undefined = undefined;
      if (createRecordDto.driverId) {
        driver = await this.driversService.findOne(createRecordDto.driverId);
        if (!driver) {
          throw new NotFoundException(
            `Conductor con ID ${createRecordDto.driverId} no encontrado`,
          );
        }
      }

      // 3. Normalizar el tipo
      let tipoNormalizado = createRecordDto.tipo;
      if (tipoNormalizado) {
        const tipoLower = tipoNormalizado.toLowerCase();
        if (tipoLower === 'entrada') {
          tipoNormalizado = RecordType.ENTRADA;
        } else if (tipoLower === 'salida') {
          tipoNormalizado = RecordType.SALIDA;
        } else {
          throw new BadRequestException('Tipo debe ser "entrada" o "salida"');
        }
      }

      // 4. Crear el registro usando el método create del repositorio
      const recordToCreate = {
        vehicleId: createRecordDto.vehicleId,
        driverId: createRecordDto.driverId,
        fecha: createRecordDto.fecha,
        hora: createRecordDto.hora,
        kilometraje: createRecordDto.kilometraje,
        tipo: tipoNormalizado,
      };

      const record = this.recordRepository.create(recordToCreate);
      console.log('🟡 [SERVICE CREATE] Record entity created:', record);

      // 5. Guardar el registro
      const savedRecord = await this.recordRepository.save(record);
      console.log('✅ [SERVICE CREATE] Record saved to database:', savedRecord);

      // 6. CARGAR EL REGISTRO COMPLETO CON RELACIONES - ESTA ES LA CLAVE
      const fullRecord = await this.recordRepository
        .createQueryBuilder('record')
        .leftJoinAndSelect('record.vehicle', 'vehicle')
        .leftJoinAndSelect('record.driver', 'driver')
        .where('record.id = :id', { id: savedRecord.id })
        .getOne();

      if (!fullRecord) {
        throw new NotFoundException(
          'El registro no se encontró después de guardarlo.',
        );
      }

      console.log('✅ [SERVICE CREATE] Full record with complete relations:', {
        id: fullRecord.id,
        createdAt: fullRecord.createdAt,
        vehicle: fullRecord.vehicle
          ? `${fullRecord.vehicle.placa} (${fullRecord.vehicle.marca} ${fullRecord.vehicle.modelo})`
          : 'NULL',
        driver: fullRecord.driver
          ? `${fullRecord.driver.nombre} (${fullRecord.driver.licencia})`
          : 'NULL',
        fecha: fullRecord.fecha,
        hora: fullRecord.hora,
        kilometraje: fullRecord.kilometraje,
        tipo: fullRecord.tipo,
      });

      return fullRecord;
    } catch (error) {
      console.error('🔴 [SERVICE CREATE] Database error:', error);
      throw error;
    }
  }

  async findAll(filterRecordsDto: FilterRecordsDto): Promise<VehicleRecord[]> {
    const { fecha, vehicleId, driverId, tipo, startDate, endDate } =
      filterRecordsDto;

    const queryBuilder = this.recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.vehicle', 'vehicle')
      .leftJoinAndSelect('record.driver', 'driver')
      .orderBy('record.fecha', 'DESC')
      .addOrderBy('record.hora', 'DESC');

    if (fecha) {
      queryBuilder.andWhere('record.fecha = :fecha', { fecha });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('record.fecha BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (vehicleId) {
      queryBuilder.andWhere('record.vehicleId = :vehicleId', { vehicleId });
    }

    if (driverId) {
      queryBuilder.andWhere('record.driverId = :driverId', { driverId });
    }

    if (tipo) {
      const tipoEnum = this.mapStringToRecordType(tipo);
      if (tipoEnum) {
        queryBuilder.andWhere('record.tipo = :tipo', { tipo: tipoEnum });
      }
    }

    return await queryBuilder.getMany();
  }

  // Método auxiliar para mapear string a RecordType
  private mapStringToRecordType(tipo: string): RecordType | null {
    const tipoLower = tipo.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (tipoLower === 'entrada' || tipoLower === RecordType.ENTRADA) {
      return RecordType.ENTRADA;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    } else if (tipoLower === 'salida' || tipoLower === RecordType.SALIDA) {
      return RecordType.SALIDA;
    }
    return null;
  }

  async getFilterOptions(): Promise<{
    vehicles: { id: string; placa: string; marca: string; modelo: string }[];
    drivers: { id: string; nombre: string; licencia: string }[];
  }> {
    try {
      console.log('🟡 Starting getFilterOptions...');

      const [vehicles, drivers] = await Promise.all([
        this.vehiclesService.findAll(),
        this.driversService.findActiveDrivers(),
      ]);

      console.log('🟡 Vehicles found:', vehicles.length);
      console.log('🟡 Drivers found:', drivers.length);

      const vehicleOptions = vehicles.map((vehicle) => ({
        id: vehicle.id,
        placa: vehicle.placa,
        marca: vehicle.marca,
        modelo: vehicle.modelo,
      }));

      const driverOptions = drivers.map((driver) => ({
        id: driver.id,
        nombre: driver.nombre,
        licencia: driver.licencia,
      }));

      console.log('✅ Filter options prepared successfully');
      return {
        vehicles: vehicleOptions,
        drivers: driverOptions,
      };
    } catch (error) {
      console.error('❌ Error in getFilterOptions:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('❌ Error stack:', error.stack);
      return {
        vehicles: [],
        drivers: [],
      };
    }
  }

  async update(
    id: string,
    updateRecordDto: UpdateRecordDto,
  ): Promise<VehicleRecord> {
    const record = await this.findOne(id); // Esto ya carga las relaciones

    // Si se actualiza vehicleId, cargar el nuevo vehículo
    if (
      updateRecordDto.vehicleId &&
      updateRecordDto.vehicleId !== record.vehicleId
    ) {
      const vehicle = await this.vehiclesService.findOne(
        updateRecordDto.vehicleId,
      );
      record.vehicle = vehicle;
      record.vehicleId = vehicle.id;
    }

    // Si se actualiza driverId, cargar el nuevo conductor
    if (updateRecordDto.driverId !== undefined) {
      if (
        updateRecordDto.driverId &&
        updateRecordDto.driverId !== record.driverId
      ) {
        const driver = await this.driversService.findOne(
          updateRecordDto.driverId,
        );
        record.driver = driver;
        record.driverId = driver.id;
      } else if (updateRecordDto.driverId === null) {
        // Permitir establecer driver como null
        // record.driver = null;
        // record.driverId = null;
      }
    }

    // Actualizar otros campos
    Object.assign(record, updateRecordDto);

    const updatedRecord = await this.recordRepository.save(record);

    // Recargar con relaciones completas
    return await this.findOne(updatedRecord.id);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id); // Ensure record exists
    await this.recordRepository.remove(record);
  }
}
