import { ICommonData } from './common-data';

export interface IPriceDetail extends ICommonData {
  Id?: number;
  PriceId?: number;
  VihicleCategoryId?: number;
  Price?: number;
  Notes?: string;
}
