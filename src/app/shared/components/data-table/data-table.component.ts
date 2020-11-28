import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ITableCol } from '@app/shared/interfaces/table-col';
import { TimeService } from '@app/shared/services/time.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() hasSelect: boolean;
  @Input() hasFunctionalBtn = true;
  @Input() dataList: any[] = [];
  @Input() filteredDataList: any[] = [];
  @Input() columns: ITableCol[] = [];
  @Input() isHasFilter = true;
  @Input() extraFunctionButton: {
    display: string;
    color: string;
    isDisabled: (...params: any) => boolean;
    onClick: (...params: any) => void;
  }[] = [];

  @Output() viewEmitter = new EventEmitter<any>();
  @Output() editEmitter = new EventEmitter<any>();
  @Output() deleteEmitter = new EventEmitter<any>();
  @Output() selectedValuesEmitter = new EventEmitter<any[]>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(this.dataList);
  selection = new SelectionModel<any>(true, []);
  hideFilter = true;
  filterValue: { [key: string]: { value: any; type: 'text' | 'select' | 'number' | 'date' | 'datetime' } } = {};
  /** Pagination */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private timeService: TimeService) {}
  ngOnInit(): void {
    if (this.hasSelect) {
      this.columns.unshift({ key: 'select', display: '' });
    }

    if (this.hasFunctionalBtn) {
      this.columns.push({ key: 'functional', display: '' });
    }
    this.displayedColumns = this.columns.map((value) => value.key);
  }

  ngOnChanges(): void {
    // this.filterValue = {};
    // this.filteredDataList = [...this.dataList];
    this.filter();
    this.updateSource();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedValuesEmitter.emit([]);
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
      this.selectedValuesEmitter.emit(this.selection.selected);
    }
  }

  onView(element: any): void {
    this.viewEmitter.emit(element);
  }

  onEdit(element: any): void {
    this.editEmitter.emit(element);
  }

  onDelete(element: any): void {
    this.deleteEmitter.emit(element);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  toggleFilter(): void {
    this.hideFilter = !this.hideFilter;
    if (this.hideFilter) {
      this.filterValue = {};
      this.filteredDataList = [...this.dataList];
      this.updateSource();
    }
  }

  onSelectItem(event: MatCheckboxChange, value: any): void {
    if (event) {
      this.selection.toggle(value);
    }
    this.selectedValuesEmitter.emit(this.selection.selected);
  }

  onFilter(column: ITableCol, event: any): void {
    this.filterValue[column.key] = {
      value: event.target.value,
      type: column.filterType || 'text'
    };
    if (!this.filterValue[column.key].value) {
      delete this.filterValue[column.key];
    }
    this.filter();
    this.updateSource();
  }

  filter(): void {
    this.filteredDataList = [...this.dataList];
    for (const filterKey in this.filterValue) {
      if (Object.prototype.hasOwnProperty.call(this.filterValue, filterKey)) {
        const element = this.filterValue[filterKey];
        if (element) {
          this.filteredDataList = this.filteredDataList.filter((data) => {
            switch (element.type) {
              case 'text':
                return data[filterKey]?.toLowerCase().includes(element.value.trim().toLowerCase());
              case 'number':
                return data[filterKey] === +element.value || element.value === '';
              case 'date':
                return (
                  data[filterKey] === this.timeService.toDateString(element.value) ||
                  this.timeService.toDateString(new Date(data[filterKey])) ===
                    this.timeService.toDateString(element.value)
                );
              case 'datetime':
                return (data[filterKey] as string).startsWith(this.timeService.toDateString(element.value));
              case 'select':
              default:
                return false;
            }
          });
        }
      }
    }
  }

  updateSource(): void {
    this.dataSource = new MatTableDataSource<any>(this.filteredDataList);
    this.selection.clear();
    this.dataSource.paginator = this.paginator;
  }
}
