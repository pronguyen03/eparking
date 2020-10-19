import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ITableCol } from '@app/shared/interfaces/table-col';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() hasSelect: boolean;
  @Input() hasFunctionalBtn = true;
  @Input() dataList: any[] = [];
  @Input() columns: ITableCol[] = [];

  @Output() viewEmitter = new EventEmitter<any>();
  @Output() editEmitter = new EventEmitter<any>();
  @Output() deleteEmitter = new EventEmitter<any>();
  @Output() selectedValuesEmitter = new EventEmitter<any[]>();
  displayedColumns: string[];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(this.dataList);
  selection = new SelectionModel<any>(true, []);
  hideFilter = true;
  /** Pagination */
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    this.dataSource = new MatTableDataSource<any>(this.dataList);
    this.selection.clear();
    this.dataSource.paginator = this.paginator;
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
  }

  onSelectItem(event: MatCheckboxChange, value: any): void {
    if (event) {
      this.selection.toggle(value);
    }
    this.selectedValuesEmitter.emit(this.selection.selected);
  }
}
