import { ICommonData } from './common-data';

export class IVehicleCategory extends ICommonData {
  Id: number;
  EParkingId: number;
  Name: string;
  Description: string;
  Price: number;
}
