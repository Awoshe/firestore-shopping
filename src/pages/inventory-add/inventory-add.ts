import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  NavParams,
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryProvider } from '../../providers/inventory/inventory';

@IonicPage()
@Component({
  selector: 'page-inventory-add',
  templateUrl: 'inventory-add.html',
})
export class InventoryAddPage {
  inShoppingList: boolean = false;
  addGroceryForm: FormGroup;
  teamId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public inventoryProvider: InventoryProvider,
    formBuilder: FormBuilder
  ) {
    this.inShoppingList = this.navParams.get('inShoppingList');
    this.addGroceryForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      quantity: [0, Validators.compose([Validators.required])],
      units: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    this.inventoryProvider.getTeamId().then(teamId => {
      this.teamId = teamId;
    });
  }

  async addGrocery(): Promise<any> {
    if (!this.addGroceryForm.valid) {
      console.log('Form not ready');
    } else {
      // All the logic will live here.
      let loading: Loading;
      loading = this.loadingCtrl.create();
      loading.present();

      const name: string = this.addGroceryForm.value.name;
      const quantity: number = parseFloat(this.addGroceryForm.value.quantity);
      const units: string = this.addGroceryForm.value.units;

      try {
        // Here we'll talk to the provider
        await this.inventoryProvider.createGrocery(
          name,
          quantity,
          units,
          this.teamId,
          this.inShoppingList
        );
        await loading.dismiss();
        this.navCtrl.pop();
      } catch (error) {
        await loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }],
        });
        alert.present();
      }
    }
  }
}
