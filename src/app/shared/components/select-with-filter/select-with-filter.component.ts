import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISelectionConfig } from './selection-config';

@Component({
  selector: 'app-select-with-filter',
  templateUrl: './select-with-filter.component.html',
  styleUrls: ['./select-with-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectWithFilterComponent),
      multi: true
    }
  ]
})
export class SelectWithFilterComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() selectionConfig: ISelectionConfig;
  @Output() selectEmitter = new EventEmitter<any>();
  /** control for the selected bank */
  public formCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public filterFormCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredOptions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  onChange: any = () => {};

  onTouch: any = () => {};
  isDisabled = false;
  constructor() {}

  writeValue(value: any): void {
    this.formCtrl.setValue(value);
    this.onChange(value);
    this.onTouch(value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit() {
    // load the initial bank list
    this.filteredOptions.next(this.options?.slice() || []);

    // listen for search field value changes
    this.filterFormCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterListOptions();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options) {
      this.filteredOptions.next(this.options?.slice() || []);
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterListOptions() {
    if (!this.options) {
      return;
    }
    // get the search keyword
    let search = this.filterFormCtrl.value;
    if (!search) {
      this.filteredOptions.next(this.options.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredOptions.next(
      this.options.filter((options) => options[this.selectionConfig.displayKey].toLowerCase().indexOf(search) > -1)
    );
  }

  onSelect(value: any): void {
    this.onChange(value);
    const selectedObj = this.options.find((option) => option[this.selectionConfig.valueKey] === value);
    if (selectedObj) {
      this.selectEmitter.emit(selectedObj);
    }
    this.onTouch();
  }
}
