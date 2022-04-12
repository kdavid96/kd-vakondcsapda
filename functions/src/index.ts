import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {firebaseAccountCredentials} from "../serviceAccountCredentials";

const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kd-vakondcsapda-default-rtdb.europe-west1.firebasedatabase.app/",
});

exports.scoreNotification =
        functions.firestore.document("/reactionTimes/{documentId}")
            .onCreate(async (snap, context) => {
              const points: string = snap.data().points;
              const userId: string = snap.data().id;
              const payload = {
                notification: {
                  title: "Újabb eredmény került regisztrálásra!",
                  body: "Pontok: " + points.toString(),
                },
              };
              functions.logger.info("payload", payload);
              functions.logger.info("userId", userId);
              functions.logger.info("context", context);
              let token: string;
              const tokenSnapshot =
                  await admin.firestore().collection("tokens");
              tokenSnapshot.get()
                  .then((querySnapshot) => {
                    const tempArray = querySnapshot.docs.map((doc) => {
                      return {...doc.data()};
                    });
                    tempArray.map((array) => {
                      token = array[Object.keys(array)[0]];
                    });
                    try {
                      admin.messaging().sendToDevice(token, payload);
                    } catch (error) {
                      console.log(error);
                    }
                  });
            });
