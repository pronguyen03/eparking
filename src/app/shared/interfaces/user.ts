import { ICommonData } from './common-data';

export interface IUser extends ICommonData {
  EParkingId: number;
  CustomerId: number;
  Id: number;
  Username: string;
  FullName: string;
  Sex: boolean;
  Dob: string;
  Mobile: string;
  Email: string;
  Address: string;
  Zalo: string;
  Skype: string;
  Facebook: string;
  AccountNumber: string;
  Bank: string;
  RoleId: number;
  Image: string;
  Actived: boolean;
  RoleName: string;
  TokenKey?: string;
  ExpriedTime?: Date;
}
