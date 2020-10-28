import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudType } from '@app/shared/enums/crud-type.enum';
import { VehicleCategoryService } from '@app/shared/services/vehicle-category.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-category-detail',
  templateUrl: './vehicle-category-detail.component.html',
  styleUrls: ['./vehicle-category-detail.component.scss']
})
export class VehicleCategoryDetailComponent implements OnInit {
  CrudType = CrudType;
  categoryForm: FormGroup;
  crudType: CrudType;
  id: number;

  constructor(
    private fb: FormBuilder,
    private vehicleCategoryService: VehicleCategoryService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      this.crudType = params.crudType;
      this.id = +params.id;
      if (this.id) {
        this.getVehicleCategoryById(this.id);
      }
    });
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      Id: [0],
      EParkingId: [environment.parkingId],
      Name: [''],
      Description: [''],
      Price: [0]
    });
  }

  getVehicleCategoryById(categoryId: number): void {
    this.vehicleCategoryService.getVehicleCategoryById(categoryId).subscribe((category) => {
      this.categoryForm.patchValue({
        Id: category.Id,
        EParkingId: category.EParkingId,
        Name: category.Name,
        Description: category.Description,
        Price: category.Price
      });
    });
  }

  save(): void {
    switch (this.crudType) {
      case CrudType.CREATE:
        this.create();
        break;
      case CrudType.EDIT:
        this.update();
        break;
      default:
        break;
    }
  }

  back(): void {
    this.router.navigateByUrl('master-data/vehicle-categories');
  }

  create(): void {
    if (this.categoryForm.valid) {
      const {
        Id,
        EParkingId,
        Name,
        Description,
        Price,
       } = this.categoryForm.value;
      const reqData = {
        Id,
        EParkingId,
        Name,
        Description,
        Price
      };

      this.vehicleCategoryService.addVehicleCategory(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Created Employee successfully.', 'Vehicle Caterogy');
          this.back();
        }
      });
    }
  }

  update(): void {
    if (this.categoryForm.valid) {
      const {
        Id,
        EParkingId,
        Name,
        Description,
        Price,
       } = this.categoryForm.value;
      const reqData = {
        Id,
        EParkingId,
        Name,
        Description,
        Price
      };

      this.vehicleCategoryService.updateVehicleCategory(reqData).subscribe((res) => {
        if (res.Code === '100') {
          this.toastr.success('Updated successfully.', 'Vehicle Caterogy');
          this.back();
        }
      });
    }
  }

}
