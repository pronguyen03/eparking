import { ICommonData } from './common-data';

export interface IVehicle extends ICommonData {
  Id: number;
  eParkingId: number;
  CustomerId: number;
  Plate: string;
  TypeId: number;
  TypeName?: string;
  CurrentStatus: string;
  DateOfPayment: string;
  ImagePath: string;
  Actived: true;
  IsDeleted: boolean;
  IsApproved: boolean;
  WhoApproved: number;
  DateApproved: string;
  Notes: string;
  Status: number;
  StatusName?: string;
  CustomerName: string;
  IsMonthly: boolean;
}
