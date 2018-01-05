import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InventoryPage } from '../pages/inventory/inventory';
import { ShoppingListPage } from '../pages/shopping-list/shopping-list';
import { AuthProvider } from '../providers/auth/auth';
import { InventoryProvider } from '../providers/inventory/inventory';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from './credentials';

@NgModule({
  declarations: [MyApp, TabsPage, InventoryPage, ShoppingListPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, TabsPage, InventoryPage, ShoppingListPage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    InventoryProvider,
  ],
})
export class AppModule {}
