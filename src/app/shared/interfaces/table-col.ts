export interface ITableCol {
  key: string;
  display: string;
  type?: string;
  filterable?: boolean;
  filterType?: 'input' | 'select';
}
