import { ICommonData } from './common-data';

export interface IRequestEntry extends ICommonData {
  Id: number;
  EParkingId: number;
  CustomerId: number;
  RequestDetailed: string;
  VisitorName: string;
  VisitorTel: string;
  VisitorPassport: string;
  NumberVisitor: number;
  IsVihicle: boolean;
  StartTime: string;
  EndTime: string;
  TypeId: number;
  TypePayment: boolean;
  UserInitial: number;
  DateOfInitial: string;
  UserUpdate: number;
  InputRealTime: string;
  IsDone: boolean;
  NoteDone: string;
}
