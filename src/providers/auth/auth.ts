import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import firebase from 'firebase/app';
import { userProfile } from '../../models/user-profile';
import { teamProfile } from '../../models/team-profile';

import { InventoryProvider } from '../inventory/inventory';

@Injectable()
export class AuthProvider {

  constructor(
    public afAuth: AngularFireAuth,
    public fireStore: AngularFirestore,
    public inventoryProvider: InventoryProvider
  ) { }

  loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  async createAdminUser(
    email: string,
    password: string
  ): Promise<firebase.User> {
    try {
      const adminUserCredential: firebase.auth.UserCredential = await this.afAuth.auth
        .createUserWithEmailAndPassword(
          email,
          password
        );
      const userProfileDocument: AngularFirestoreDocument<
        userProfile
        > = this.fireStore.doc(`userProfile/${adminUserCredential.user.uid}`);

      const teamId: string = this.fireStore.createId();

      await userProfileDocument.set({
        id: adminUserCredential.user.uid,
        email: email,
        teamId: teamId,
        teamAdmin: true
      });

      const teamProfile: AngularFirestoreDocument<
        teamProfile
        > = this.fireStore.doc(`teamProfile/${teamId}`);

      await teamProfile.set({
        id: teamId,
        teamAdmin: adminUserCredential.user.uid,
        groceryList: null
      });

      return adminUserCredential.user;
    } catch (error) {
      console.error(error);
    }
  }

  async createRegularUser(email: string): Promise<any> {
    const teamId: string = await this.inventoryProvider.getTeamId();

    const userCollection: AngularFirestoreCollection<
      any
      > = this.fireStore.collection(`teamProfile/${teamId}/teamMemberList`);
    const id: string = this.fireStore.createId();

    const regularUser = {
      id: id,
      email: email,
      teamId: teamId
    };

    return userCollection.add(regularUser);
  }

}
