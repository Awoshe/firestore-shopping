import { Component } from '@angular/core';
import { Alert, AlertController, NavController } from 'ionic-angular';
import { InventoryProvider } from '../../providers/inventory/inventory';
import { Grocery } from '../../models/grocery';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {
  groceryList: Observable<Grocery[]>;
  constructor(
    public navCtrl: NavController,
    public inventoryProvider: InventoryProvider,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    this.inventoryProvider.getTeamId().then(teamId => {
      this.groceryList = this.inventoryProvider
        .getGroceryList(teamId)
        .valueChanges();
    });
  }

  addUser(): void {
    this.navCtrl.push('AddUserPage');
  }

  createGrocery(): void {
    this.navCtrl.push('InventoryAddPage');
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
            const quantity: number = parseFloat(data.quantity);
            this.inventoryProvider.addGroceryQuantity(
              groceryId,
              quantity,
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
            const quantity: number = parseFloat(data.quantity);
            this.inventoryProvider.removeGroceryQuantity(
              groceryId,
              quantity,
              teamId
            );
          },
        },
      ],
    });
    prompt.present();
  }
}
