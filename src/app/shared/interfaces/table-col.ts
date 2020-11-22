export interface ITableCol {
  key: string;
  display: string;
  type?: undefined | 'date' | 'dateTime' | 'dateString' | 'boolean' | 'dateTimeString';
  filterable?: boolean;
  filterType?: 'input' | 'select';
  selectionList?: any[];
  isTranslated?: boolean;
}
