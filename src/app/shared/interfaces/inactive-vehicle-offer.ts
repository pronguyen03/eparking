import { ICommonData } from './common-data';

export interface IInactiveVehicleOffer extends ICommonData {
  Id: number;
  eParkingId: number;
  CustomerId: number;
  VihicleId: number;
  DateOffer: string;
  ContentOffer: string;
  DateStartOffer: string;
  IsApproved: true;
  DateApproved: string;
  WhoApproved: number;
  Status: number;
  Notes: string;
}
