import { ICommonData } from './common-data';

export interface ICustomer extends ICommonData{
  CustomerId: number;
  eParkingId: number;
  CustomerName: string;
  Address: string;
  ContactName: null;
  Mobile: string;
  Tel: string;
  Fax: string;
  Email: string;
  TaxCode: string;
  Account: string;
  Bank: string;
  CreateTime: string;
  Disable: boolean;
  LastUpdate: string;
}
