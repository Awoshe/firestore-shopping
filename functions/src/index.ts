import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

exports.createTeamMember = functions.firestore
  .document(`teamProfile/{teamId}/teamMemberList/{newUserId}`)
  .onCreate(async (snapshot, context) => {

    const id: string = snapshot.data().id;
    const email: string = snapshot.data().email;
    const teamId: string = snapshot.data().teamId;

    const newUser = await admin.auth().createUser({
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