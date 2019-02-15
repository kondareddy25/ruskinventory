import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm, AbstractControl } from '@angular/forms';
import { InventoryService } from '../service/inventory.service';
import { SupplierInventory } from '../model/Supplier.inventory.model';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

export let browserRefresh = false;

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
sample: string;
transactionForm: FormGroup;
animals: any[];
suppliers: any[];
submitted = false;
subscription: Subscription;

constructor(private router: Router, private formBuilder: FormBuilder, private inventoryservice: InventoryService) {
  this.subscription = router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      browserRefresh = !router.navigated;
    }
});
}

  ngOnInit() {
    this.sample = 'konda app';
    this.transactionForm = this.formBuilder.group({
      formGroupArrivalDate: ['', Validators.required],
      supplierName: ['', Validators.required],
      formGroupTypeOfBox: ['', Validators.required],
      formGroupNoOfBoxes: ['', Validators.required],
      formGroupTotalInKG: [''],
      formGroupTotalAmount: ['', Validators.required],
    });
    this.inventoryservice.getAllModelTypes().subscribe( data => {
      this.animals = JSON.parse(JSON.stringify(data));
      console.log('data from modelbox' + JSON.stringify(data));
     });
     this.inventoryservice.getAllSuppliers().subscribe( data => {
      this.suppliers = JSON.parse(JSON.stringify(data));
      console.log('data from modelbox' + JSON.stringify(data));
     });
  }

  get f() { return this.transactionForm.controls; }
    onSubmit(transactionForm: NgForm) {
      this.submitted = true;

      // stop here if form is invalid
      if (this.transactionForm.invalid) {
          return;
      }
      // alert('SUCCESS!! :-)');
      console.log('value' + this.transactionForm.controls);
      const supplierInventory = new SupplierInventory();
      supplierInventory.arrivalDate = transactionForm.controls.formGroupArrivalDate.value;
      supplierInventory.supplierId = transactionForm.controls.supplierName.value;
      supplierInventory.typeOfBox = transactionForm.controls.formGroupTypeOfBox.value.split(' ')[0];
      supplierInventory.noofBoxes = transactionForm.controls.formGroupNoOfBoxes.value;
      supplierInventory.totalweight = transactionForm.controls.formGroupTotalInKG.value.split(' ')[0];
      supplierInventory.totalAmount = transactionForm.controls.formGroupTotalAmount.value;
      this.inventoryservice.saveSupplierInventory(supplierInventory).subscribe( data => {
       alert('successfully saved the data');
       transactionForm.reset();
       let control: AbstractControl = null;
       Object.keys(transactionForm.controls).forEach((name) => {
        control = transactionForm.controls[name];
        control.setErrors(null);
        // this.router.navigate(['login']);
      });
      });
    }
    calculateTotalKG() {
      if (!this.transactionForm.controls.formGroupNoOfBoxes && !this.transactionForm.controls.formGroupTypeOfBox ) {
        return;
      }
     const typeOfBox = this.transactionForm.controls.formGroupTypeOfBox.value;
     const noOfBoxes = this.transactionForm.controls.formGroupNoOfBoxes.value;
     const boxweight = typeOfBox.split(' ');
     const totalWeight = boxweight[0] * noOfBoxes;
     console.log('totalWeight' + totalWeight);
     this.transactionForm.controls.formGroupTotalInKG.setValue(totalWeight + ' KG');
    //  this.totalRusk = (this.totalRusk + totalWeight);
    }

}
