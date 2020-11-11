import { ICommonData } from './common-data';

export interface IPrice extends ICommonData {
  Id: number;
  eParkingId: number;
  CustomerId: number;
  ContractsNumber: string;
  ValidFromDate: string;
  ValidToDate: string;
  IsActived: boolean;
  ActiveTime: string;
  CustomerName: string;
}
