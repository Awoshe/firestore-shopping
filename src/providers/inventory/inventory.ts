import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Grocery } from '../../models/grocery';

@Injectable()
export class InventoryProvider {
  userId: string;

  constructor(
    public fireStore: AngularFirestore,
    public afAuth: AngularFireAuth
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
      `/teamProfile/${teamId}/groceryList`,
      ref => ref.orderBy('quantity')
    );
  }

  getGroceryListForShoppingList(
    teamId: string,
    isInShoppingList: boolean
  ): AngularFirestoreCollection<Grocery> {
    return this.fireStore.collection<Grocery>(
      `/teamProfile/${teamId}/groceryList`,
      ref =>
        ref
          .where('inShoppingList', '==', isInShoppingList)
          .where('picked', '==', false)
    );
  }

  getPickedGroceryListForShoppingList(
    teamId: string,
    isInShoppingList: boolean
  ): AngularFirestoreCollection<Grocery> {
    return this.fireStore.collection<Grocery>(
      `/teamProfile/${teamId}/groceryList`,
      ref =>
        ref
          .where('inShoppingList', '==', isInShoppingList)
          .where('picked', '==', true)
    );
  }

  createGrocery(
    name: string,
    quantity: number,
    units: string,
    teamId: string,
    inShoppingList: boolean = false
  ): Promise<void> {
    const groceryId: string = this.fireStore.createId();

    return this.fireStore
      .doc<Grocery>(`/teamProfile/${teamId}/groceryList/${groceryId}`)
      .set({
        id: groceryId,
        name,
        quantity,
        units,
        teamId,
        inShoppingList,
        picked: false,
        quantityShopping: 0
      });
  }

  addGroceryQuantity(
    groceryId: string,
    quantity: number,
    teamId: string
  ): Promise<void> {
    const groceryRef = this.fireStore.doc(
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

  addGroceryToShoppingList(groceryId: string, teamId: string): Promise<void> {
    const groceryRef = this.fireStore.doc(
      `/teamProfile/${teamId}/groceryList/${groceryId}`
    );

    return groceryRef.update({
      inShoppingList: true
    });
  }

  removeGroceryFromShoppingList(
    groceryId: string,
    teamId: string
  ): Promise<void> {
    const groceryRef = this.fireStore.doc(
      `/teamProfile/${teamId}/groceryList/${groceryId}`
    );

    return groceryRef.update({
      inShoppingList: false
    });
  }

  pickUpGroceryFromShoppingList(
    groceryId: string,
    quantityShopping: number,
    teamId: string
  ): Promise<void> {
    const groceryRef = this.fireStore.doc(
      `/teamProfile/${teamId}/groceryList/${groceryId}`
    ).ref;

    return this.fireStore.firestore.runTransaction(transaction => {
      return transaction.get(groceryRef).then(groceryDoc => {
        const newQuantity: number =
          groceryDoc.data().quantity + quantityShopping;

        transaction.update(groceryRef, {
          quantity: newQuantity,
          quantityShopping: quantityShopping,
          picked: true
        });
      });
    });
  }

  addQuantityGroceryFromShoppingList(
    groceryId: string,
    quantityShopping: number,
    teamId: string
  ): Promise<void> {
    const groceryRef = this.fireStore.doc(
      `/teamProfile/${teamId}/groceryList/${groceryId}`
    ).ref;

    return this.fireStore.firestore.runTransaction(transaction => {
      return transaction.get(groceryRef).then(groceryDoc => {
        const newQuantity: number =
          groceryDoc.data().quantity + quantityShopping;
        const newQuantityShopping: number =
          groceryDoc.data().quantityShopping + quantityShopping;
        transaction.update(groceryRef, {
          quantity: newQuantity,
          quantityShopping: newQuantityShopping,
          picked: true
        });
      });
    });
  }

  removeQuantityGroceryFromShoppingList(
    groceryId: string,
    quantityShopping: number,
    teamId: string
  ): Promise<void> {
    const groceryRef = this.fireStore.doc(
      `/teamProfile/${teamId}/groceryList/${groceryId}`
    ).ref;

    return this.fireStore.firestore.runTransaction(transaction => {
      return transaction.get(groceryRef).then(groceryDoc => {
        const newQuantity: number =
          groceryDoc.data().quantity - quantityShopping;
        const newQuantityShopping: number =
          groceryDoc.data().quantityShopping - quantityShopping;
        transaction.update(groceryRef, {
          quantity: newQuantity,
          quantityShopping: newQuantityShopping,
          picked: true
        });
      });
    });
  }
}
