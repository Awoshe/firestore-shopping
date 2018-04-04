const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

import { UserRecord } from 'firebase-functions/lib/providers/auth';

exports.createTeamMember = functions.firestore
  .document(`teamProfile/{teamId}/teamMemberList/{newUserId}`)
  .onCreate(async (snapshot, context) => {
    const id: string = snapshot.data().id;
    const email: string = snapshot.data().email;
    const teamId: string = snapshot.data().teamId;

    const newUser: UserRecord = await admin.auth().createUser({
      uid: id,
      email: email,
      password: '123456789',
    });

    await admin
      .firestore()
      .doc(`userProfile/${id}`)
      .set({
        email: email,
        id: id,
        teamId: teamId,
        teamAdmin: false,
      });

    return newUser;
  });
