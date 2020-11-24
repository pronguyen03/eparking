import { ICommonData } from './common-data';
import { IPriceDetail } from './price-detail';

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
  ItemDetailed?: Partial<IPriceDetail>[];
}
