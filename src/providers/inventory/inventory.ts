import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Grocery } from '../../models/grocery';

@Injectable()
export class InventoryProvider {
  userId: string;
  constructor(
    public afAuth: AngularFireAuth,
    public fireStore: AngularFirestore
  ) {
    afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  async getTeamId(): Promise<string> {
    const userProfile: firebase.firestore.DocumentSnapshot = await firebase
      .firestore()
      .doc(`userProfile/${this.userId}`)
      .get();

    return userProfile.data().teamId;
  }

  getGroceryList(teamId: string): AngularFirestoreCollection<Grocery> {
    return this.fireStore.collection<Grocery>(
      `/teamProfile/${teamId}/groceryList`, // This creates the reference
      ref => ref.orderBy('quantity') // This is the query
    );
  }

  addGroceryQuantity(
    groceryId: string,
    quantity: number,
    teamId: string
  ): Promise<void> {
    const groceryRef: firebase.firestore.DocumentReference = this.fireStore.doc(
      `/teamProfile/${teamId}/groceryList/${groceryId}`
    ).ref;

    return this.fireStore.firestore.runTransaction(transaction => {
      return transaction.get(groceryRef).then(groceryDoc => {
        const newQuantity: number = groceryDoc.data().quantity + quantity;
        transaction.update(groceryRef, { quantity: newQuantity });
      });
    });
  }

  removeGroceryQuantity(
    groceryId: string,
    quantity: number,
    teamId: string
  ): Promise<void> {
    const groceryRef = this.fireStore.doc(
      `/teamProfile/${teamId}/groceryList/${groceryId}`
    ).ref;

    return this.fireStore.firestore.runTransaction(transaction => {
      return transaction.get(groceryRef).then(groceryDoc => {
        const newQuantity: number = groceryDoc.data().quantity - quantity;
        transaction.update(groceryRef, { quantity: newQuantity });
      });
    });
  }
}
