import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as _ from 'lodash';
import { format } from 'date-fns';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor() {}

  exportFile(data: any[], headers: { key: string; display: any }[], fileName: string): void {
    const listHeaderKeys = headers.map((value) => value.key);

    // Create Header Row
    const header = headers.reduce((prev, current) => {
      prev[current.key] = current.display;
      return prev;
    }, {});
    const convertedList = data.map((value) => _.pick(value, listHeaderKeys));
    convertedList.unshift(header);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(convertedList, { skipHeader: true });
    const workbook: XLSX.WorkBook = { Sheets: { 'Đăng Kí Vào Ra': worksheet }, SheetNames: ['Đăng Kí Vào Ra'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, `Dang_Ky_Vao_Ra`);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_' + format(new Date(), 'ddmmyyyy') + EXCEL_EXTENSION);
  }
}
