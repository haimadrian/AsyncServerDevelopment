const admin = require("firebase-admin");
const serviceAccount = require("./expenseapphit-firebase-adminsdk-1qhts-f00f7381b7.json");

class FirebaseApp {
    constructor() {
        this.app = undefined;
    }

    // Initialize admin-sdk, so we will be able to authorize users using firebase API.
    initializeApp() {
        this.app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
}

const firebase = new FirebaseApp();
module.exports = firebase;