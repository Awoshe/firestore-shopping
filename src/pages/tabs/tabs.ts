import { Component } from '@angular/core';
import { InventoryPage } from '../inventory/inventory';
import { ShoppingListPage } from '../shopping-list/shopping-list';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = InventoryPage;
  tab2Root = ShoppingListPage;

  constructor() {}
}
