import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../model/user.model';
import { Inventory } from '../model/Inventory.model';
import { Supplier } from '../model/Supplier.model';
import { SupplierInventory } from '../model/Supplier.inventory.model';

@Injectable()
export class InventoryService {
  constructor(private http: HttpClient) { }
  baseUrl = 'http://localhost/inventory';

  getUsers() {
    /* let fakeUsers = [{id: 1, firstName: 'Dhiraj', lastName: 'Ray', email: 'dhiraj@gmail.com'},
     {id: 1, firstName: 'Tom', lastName: 'Jac', email: 'Tom@gmail.com'},
     {id: 1, firstName: 'Hary', lastName: 'Pan', email: 'hary@gmail.com'},
     {id: 1, firstName: 'praks', lastName: 'pb', email: 'praks@gmail.com'},
   ];
   return Observable.of(fakeUsers).delay(5000);*/
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number) {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  createInventory(inventory: Inventory) {
    return this.http.post(this.baseUrl + '/create', inventory);
  }

  saveSupplier(supplier: Supplier) {
    return this.http.post(this.baseUrl + '/saveSupplier', supplier);
  }

  saveSupplierInventory(supplierInventory: SupplierInventory) {
    return this.http.post(this.baseUrl + '/saveSupplierInventory', supplierInventory);
  }

  getAllSuppliers() {
    return this.http.get(this.baseUrl + '/getAllSuppliers');
  }

  updateUser(user: User) {
    return this.http.put(this.baseUrl + '/' + user.id, user);
  }

  deleteUser(id: number) {
    return this.http.delete(this.baseUrl + '/' + id);
  }

  getAllModelTypes() {
    return this.http.get(this.baseUrl + '/getAllModelTypes');
  }

  getTotalRuskStock() {
    return this.http.get(this.baseUrl + '/getTotalRusk');
  }
  getAllInventory() {
    return this.http.get(this.baseUrl + '/getAllInventory');
  }
}
