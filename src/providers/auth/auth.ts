import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
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
  ) {
    console.log('Hello AuthProvider Provider');
  }

  loginUser(email: string, password: string): Promise<firebase.User> {
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
      const adminUser: firebase.User = await this.afAuth.auth.createUserWithEmailAndPassword(
        email,
        password
      );

      const userProfileDocument: AngularFirestoreDocument<
        userProfile
      > = this.fireStore.doc(`userProfile/${adminUser.uid}`);

      const teamId: string = this.fireStore.createId();

      await userProfileDocument.set({
        id: adminUser.uid,
        email: email,
        teamId: teamId,
        teamAdmin: true,
      });

      const teamProfile: AngularFirestoreDocument<
        teamProfile
      > = this.fireStore.doc(`teamProfile/${teamId}`);

      await teamProfile.set({
        id: teamId,
        teamAdmin: adminUser.uid,
        groceryList: null,
      });

      return adminUser;
    } catch (error) {
      console.error(error);
      throw new Error();
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
      teamId: teamId,
    };

    return userCollection.add(regularUser);
  }
}
