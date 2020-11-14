import { ICommonData } from './common-data';

export interface IAccessVehicle {
  Id?: number;
  RequestEntryId: number;
  Plate: string;
  TypeId: number;
  Name?: string;
}
