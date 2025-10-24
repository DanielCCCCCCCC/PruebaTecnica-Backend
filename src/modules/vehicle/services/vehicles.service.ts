// src/vehicles/vehicles.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Verificar si ya existe un vehículo con la misma placa
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { placa: createVehicleDto.placa },
    });

    if (existingVehicle) {
      throw new ConflictException('Ya existe un vehículo con esta placa');
    }

    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      where: { activo: true },
      select: ['id', 'placa', 'marca', 'modelo'],
      order: { placa: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }

    return vehicle;
  }

  async update(
    id: string, // Corregido: number a string
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    // Si se está actualizando la placa, verificar que no exista otra
    if (updateVehicleDto.placa && updateVehicleDto.placa !== vehicle.placa) {
      const existingVehicle = await this.vehicleRepository.findOne({
        where: { placa: updateVehicleDto.placa },
      });

      if (existingVehicle) {
        throw new ConflictException('Ya existe un vehículo con esta placa');
      }
    }

    Object.assign(vehicle, updateVehicleDto);
    return await this.vehicleRepository.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    // Corregido: number a string
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }
}
