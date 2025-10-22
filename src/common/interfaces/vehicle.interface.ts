// common/interfaces/vehicle.interface.ts
export interface IVehicle {
  id?: number;
  marca: string;
  modelo: string;
  placa: string;
  createdAt?: Date;
  updatedAt?: Date;
}
