import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
admin.initializeApp(functions.config().firebase);

exports.createTeamMember = functions.firestore
  .document(`teamProfile/{teamId}/teamMemberList/{newUserId}`)
  .onCreate(async event => {
    const id: string = event.data.data().id;
    const email: string = event.data.data().email;
    const teamId: string = event.data.data().teamId;

    const newUser: UserRecord = await admin.auth().createUser({
      uid: id,
      email: email,
      password: '123456789'
    });

    await admin
      .firestore()
      .doc(`userProfile/${id}`)
      .set({
        email: email,
        id: id,
        teamId: teamId,
        teamAdmin: false
      });

    return newUser;
  });
