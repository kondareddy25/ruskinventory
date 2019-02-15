import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm, AbstractControl } from '@angular/forms';
import { InventoryService } from '../service/inventory.service';
import { Supplier } from '../model/Supplier.model';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

export let browserRefresh = false;

@Component({
  selector: 'app-supplierdetails',
  templateUrl: './supplierdetails.component.html',
  styleUrls: ['./supplierdetails.component.css']
})
export class SupplierdetailsComponent implements OnInit {

  supplierForm: FormGroup;
  submitted = false;
  name = 'Angular';
  animals: any[];
  subscription: Subscription;

  constructor(private router: Router, private formBuilder: FormBuilder, private inventoryservice: InventoryService) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
  });

   }

  ngOnInit() {
    this.supplierForm = this.formBuilder.group({
      supplierName: ['', Validators.required],
      supplierAddress: ['', Validators.required]
    });
    this.inventoryservice.getAllModelTypes().subscribe( data => {
      this.animals = JSON.parse(JSON.stringify(data));
      console.log('data from modelbox' + JSON.stringify(data));
     });
  }
  get f() { return this.supplierForm.controls; }
    onSubmit(supplierForm: NgForm) {
      this.submitted = true;

      // stop here if form is invalid
      if (this.supplierForm.invalid) {
          return;
      }
      // alert('SUCCESS!! :-)');
      // console.log('value' + angForm.controls);
      const supplier = new Supplier();
      supplier.supplierName =  supplierForm.controls.supplierName.value;
      supplier.supplierAddress =  supplierForm.controls.supplierAddress.value;
      console.log('value' + JSON.stringify(supplier));
      this.inventoryservice.saveSupplier(supplier).subscribe( data => {
       alert('successfully saved the data');
      //  supplierForm.resetForm();
       supplierForm.reset();
       let control: AbstractControl = null;
       Object.keys(supplierForm.controls).forEach((name) => {
        control = supplierForm.controls[name];
        control.setErrors(null);
        // this.router.navigate(['login']);
      });
      //  supplierForm.controls.supplierAddress.setValue('');
      //  supplierForm.controls.supplierAddress.value = '';
      // this.router.navigate(['inventory']);
      });
    }

}
