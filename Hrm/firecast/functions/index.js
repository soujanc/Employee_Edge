const {auth} = require("firebase-admin");
const {initializeApp} = require("firebase-admin/app");
const {onCall, HttpsError} = require("firebase-functions/v2/https");

initializeApp();

exports.createEmployee = onCall(async (request) =>{
  try {
    const email = request.data.email;
    const password = request.data.password;

    if (!email || !password) {
      throw new HttpsError(
          "invalid-argument",
          `The function must be called with two arguments: 
          "email" and "password".`,
      );
    }

    const userRecord = await auth().createUser({
      email: email,
      password: password,
    });

    // Construct user data to return
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      phoneNumber: userRecord.phoneNumber,
      disabled: userRecord.disabled,
    };

    return userData;
  } catch (error) {
    console.log(error);
    throw new HttpsError("internal", error.toString());
  }
});
