import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InventoryProvider } from '../../providers/inventory/inventory';
import { Observable } from 'rxjs';
import { Grocery } from '../../models/grocery';

@IonicPage()
@Component({
  selector: 'page-shopping-list-add',
  templateUrl: 'shopping-list-add.html',
})
export class ShoppingListAddPage {
  groceryList: Observable<Grocery[]>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public inventoryProvider: InventoryProvider
  ) {}

  ionViewDidLoad() {
    this.inventoryProvider.getTeamId().then(teamId => {
      this.groceryList = this.inventoryProvider
        .getGroceryListForShoppingList(teamId, false)
        .valueChanges();
    });
  }

  addGrocery(groceryId: string, teamId: string): void {
    this.inventoryProvider.addGroceryToShoppingList(groceryId, teamId);
  }
}
