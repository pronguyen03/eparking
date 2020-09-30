import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudType } from '../../shared/enums/crud-type.enum';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  addNew(): void {
    this.router.navigate(['master-data/customers/detail', CrudType.CREATE]);
  }
}
