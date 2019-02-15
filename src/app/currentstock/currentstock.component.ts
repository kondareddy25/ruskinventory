import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, NgForm, AbstractControl } from '@angular/forms';
import { InventoryService } from '../service/inventory.service';
import { Inventory } from '../model/Inventory.model';
import { MatTableDataSource } from '@angular/material';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

export let browserRefresh = false;

@Component({
  selector: 'app-currentstock',
  templateUrl: './currentstock.component.html',
  styleUrls: ['./currentstock.component.css']
})
export class CurrentstockComponent implements OnInit {

  angForm: FormGroup;
  submitted = false;
  name = 'Angular';
  animals: any[];
  totalRusk: string;
  displayedColumns = ['id', 'arrivalDate', 'typeOfBox', 'noofBoxes', 'totalweight'];
  ELEMENT_DATA: Element[];
 dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
 subscription: Subscription;

  constructor(private router: Router, private formBuilder: FormBuilder, private inventoryservice: InventoryService) {

    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
  });

   }

  ngOnInit() {
    this.angForm = this.formBuilder.group({
      formGroupArrivalDate: ['', Validators.required],
      formGroupTypeOfBox: ['', Validators.required],
      formGroupNoOfBoxes: ['', Validators.required],
      formGroupTotalInKG: ['', Validators.required],
    });
    this.inventoryservice.getAllModelTypes().subscribe( data => {
      this.animals = JSON.parse(JSON.stringify(data));
     });
     this.inventoryservice.getTotalRuskStock().subscribe( data => {
      // this.animals = JSON.parse(JSON.stringify(data));
      const jsonData = JSON.parse(JSON.stringify(data));
      this.totalRusk = jsonData.totalCurrentStcok;
     });
     this.inventoryservice.getAllInventory().subscribe( data => {
      // this.animals = JSON.parse(JSON.stringify(data));
      const jsonData = JSON.parse(JSON.stringify(data));
      this.ELEMENT_DATA = jsonData;
      this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
     });
    // this.animals = ['dog', 'cat', 'donkey', 'buffello', 'monkey'];
    }
    get f() { return this.angForm.controls; }
    onSubmit(angForm: NgForm) {
      this.submitted = true;

      // stop here if form is invalid
      if (this.angForm.invalid) {
          return;
      }
      // alert('SUCCESS!! :-)');
      // console.log('value' + angForm.controls);
      const inventory = new Inventory();
      inventory.arrivalDate = angForm.controls.formGroupArrivalDate.value;
      inventory.typeOfBox = angForm.controls.formGroupTypeOfBox.value.split(' ')[0];
      inventory.noofBoxes = angForm.controls.formGroupNoOfBoxes.value;
      inventory.totalweight = angForm.controls.formGroupTotalInKG.value.split(' ')[0];
      console.log('value' + JSON.stringify(inventory));
      this.inventoryservice.createInventory(inventory).subscribe( data => {
       alert('successfully saved the data');
       this.angForm.reset();
       let control: AbstractControl = null;
       Object.keys(angForm.controls).forEach((name) => {
        control = angForm.controls[name];
        control.setErrors(null);
        // this.router.navigate(['login']);
      });
      });
      // this.inventoryservice.getAllInventory().subscribe( data => {
      //   // this.animals = JSON.parse(JSON.stringify(data));
      //   const jsonData = JSON.parse(JSON.stringify(data));
      //   this.ELEMENT_DATA = jsonData;
      //   this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
      //  });
    }
    calculateTotalKG() {
      if (!this.angForm.controls.formGroupNoOfBoxes && !this.angForm.controls.formGroupTypeOfBox ) {
        return;
      }
     const typeOfBox = this.angForm.controls.formGroupTypeOfBox.value;
     const noOfBoxes = this.angForm.controls.formGroupNoOfBoxes.value;
     const boxweight = typeOfBox.split(' ');
     const totalWeight = boxweight[0] * noOfBoxes;
     console.log('totalWeight' + totalWeight);
     this.angForm.controls.formGroupTotalInKG.setValue(totalWeight + ' KG');
     this.totalRusk = (this.totalRusk + totalWeight);
    }
}

export interface Element {
  id: number;
  arrivalDate: string;
  typeOfBox: string;
  noofBoxes: string;
  totalweight: string;
}

// const ELEMENT_DATA: Element[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
//   {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
//   {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
//   {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
//   {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
//   {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
//   {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
//   {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
//   {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
//   {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
// ];
