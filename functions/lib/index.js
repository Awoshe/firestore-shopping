"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
exports.createTeamMember = functions.firestore
    .document(`teamProfile/{teamId}/teamMemberList/{newUserId}`)
    .onCreate((snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    const id = snapshot.data().id;
    const email = snapshot.data().email;
    const teamId = snapshot.data().teamId;
    const newUser = yield admin.auth().createUser({
        uid: id,
        email: email,
        password: '123456789',
    });
    yield admin
        .firestore()
        .doc(`userProfile/${id}`)
        .set({
        email: email,
        id: id,
        teamId: teamId,
        teamAdmin: false,
    });
    return newUser;
}));
//# sourceMappingURL=index.js.map