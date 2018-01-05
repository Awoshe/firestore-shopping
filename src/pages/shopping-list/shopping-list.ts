import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  NavController,
  NavParams,
} from 'ionic-angular';
import { InventoryProvider } from '../../providers/inventory/inventory';
import { Observable } from 'rxjs';
import { Grocery } from '../../models/grocery';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  groceryList: Observable<Grocery[]>;
  pickedGroceryList: Observable<Grocery[]>;
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public inventoryProvider: InventoryProvider
  ) {}

  ionViewDidLoad() {
    this.inventoryProvider.getTeamId().then(teamId => {
      this.groceryList = this.inventoryProvider
        .getGroceryListForShoppingList(teamId, true)
        .valueChanges();

      this.pickedGroceryList = this.inventoryProvider
        .getPickedGroceryListForShoppingList(teamId, true)
        .valueChanges();
    });
  }

  addBulkGroceries(): void {
    this.navCtrl.push('ShoppingListAddPage');
  }

  addSingleGrocery(): void {
    this.navCtrl.push('InventoryAddPage', { inShoppingList: true });
  }

  pickQuantity(
    groceryId: string,
    name: string,
    units: string,
    teamId: string
  ): void {
    const prompt: Alert = this.alertCtrl.create({
      message: `How many ${units} of ${name} are you picking up?`,
      inputs: [{ name: 'quantity', placeholder: `1`, type: 'number' }],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Add',
          handler: data => {
            const quantityShopping: number = parseFloat(data.quantity);
            this.inventoryProvider.pickUpGroceryFromShoppingList(
              groceryId,
              quantityShopping,
              teamId
            );
          },
        },
      ],
    });
    prompt.present();
  }

  addGrocery(groceryId: string, teamId: string): void {
    const prompt: Alert = this.alertCtrl.create({
      message: 'How many are you adding?',
      inputs: [
        {
          name: 'quantity',
          placeholder: '0',
          type: 'number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Add',
          handler: data => {
            const quantityShopping: number = parseFloat(data.quantity);
            this.inventoryProvider.addQuantityGroceryFromShoppingList(
              groceryId,
              quantityShopping,
              teamId
            );
          },
        },
      ],
    });
    prompt.present();
  }

  removeGrocery(groceryId: string, teamId: string): void {
    const prompt: Alert = this.alertCtrl.create({
      message: 'How many are you taking out?',
      inputs: [
        {
          name: 'quantity',
          placeholder: '0',
          type: 'number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Take Out',
          handler: data => {
            const quantityShopping: number = parseFloat(data.quantity);
            this.inventoryProvider.removeQuantityGroceryFromShoppingList(
              groceryId,
              quantityShopping,
              teamId
            );
          },
        },
      ],
    });
    prompt.present();
  }
}
