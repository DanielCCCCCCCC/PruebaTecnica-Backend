// common/interfaces/vehicle.interface.ts
export interface IVehicle {
  id?: string;
  marca: string;
  modelo: string;
  placa: string;
  createdAt?: Date;
  updatedAt?: Date;
}
