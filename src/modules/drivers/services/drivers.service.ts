// src/drivers/services/drivers.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Driver } from '../entities/driver.entity';
import { CreateDriverDto } from '../dto/create-driver.dto';
import { UpdateDriverDto } from '../dto/update-driver.dto';
import { FilterDriversDto } from '../dto/filter-drivers.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    // Verificar si ya existe un motorista con la misma licencia
    const existingDriver = await this.driverRepository.findOne({
      where: { licencia: createDriverDto.licencia },
    });

    if (existingDriver) {
      throw new ConflictException('Ya existe un motorista con esta licencia');
    }

    const driver = this.driverRepository.create(createDriverDto);
    return await this.driverRepository.save(driver);
  }

  async findAll(filterDriversDto: FilterDriversDto): Promise<Driver[]> {
    const { nombre, licencia, activo } = filterDriversDto;

    const where: FindOptionsWhere<Driver> = {};

    if (nombre) {
      where.nombre = Like(`%${nombre}%`);
    }

    if (licencia) {
      where.licencia = Like(`%${licencia}%`);
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    return await this.driverRepository.find({
      where,
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id },
    });

    if (!driver) {
      throw new NotFoundException(`Motorista con ID ${id} no encontrado`);
    }

    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    const driver = await this.findOne(id);

    // Si se está actualizando la licencia, verificar que no exista otra
    if (
      updateDriverDto.licencia &&
      updateDriverDto.licencia !== driver.licencia
    ) {
      const existingDriver = await this.driverRepository.findOne({
        where: { licencia: updateDriverDto.licencia },
      });

      if (existingDriver) {
        throw new ConflictException('Ya existe un motorista con esta licencia');
      }
    }

    Object.assign(driver, updateDriverDto);
    return await this.driverRepository.save(driver);
  }

  async remove(id: string): Promise<void> {
    const driver = await this.findOne(id);
    await this.driverRepository.remove(driver);
  }

  async findActiveDrivers(): Promise<Driver[]> {
    return await this.driverRepository.find({
      where: { activo: true },
      select: ['id', 'nombre', 'licencia'],
      order: { nombre: 'ASC' },
    });
  }
}
