export interface ITableCol {
  key: string;
  display: string;
  type?: undefined | 'date' | 'dateTime' | 'dateString' | 'boolean' | 'dateTimeString';
  filterable?: boolean;
  filterType?: 'text' | 'select' | 'number' | 'date' | 'datetime';
  selectionList?: any[];
  isTranslated?: boolean;
  width?: string;
}
