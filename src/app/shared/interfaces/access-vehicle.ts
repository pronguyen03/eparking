import { ICommonData } from './common-data';

export interface IAccessVehicle extends ICommonData {
  Id?: number;
  RequestEntryId: number;
  Plate: string;
  TypeId: number;
  Name?: string;
}
