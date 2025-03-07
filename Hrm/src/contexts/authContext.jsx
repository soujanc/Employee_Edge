import { createContext, useState, useEffect } from "react";
import {
  auth,
  firestore,
  provider,
} from "../services/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  // Function to generate a unique ID
  const generateUniqueId = () => {
    return uuidv4();
  };



  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function fetchUserData(uid) {
    const userDocRef = doc(db, "users", uid);
    return getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          return docSnapshot.data();
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        throw error;
      });
  }

  function logout() {
    return firebaseSignOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid)
          .then((userData) => {
            setCurrentUser({ ...user, ...userData });
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            setCurrentUser(user); // Fallback to basic user data
            setLoading(false);
          });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    login,
    resetPassword,
    logout, // Adding the logout function here
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}



// import { createContext, useState, useEffect, useContext } from "react";
// import {
//   auth,
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
//   onAuthStateChanged,
//   signOut as firebaseSignOut,
// } from "firebase/auth";
// import { doc, getDoc, getFirestore } from "firebase/firestore";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const db = getFirestore();

//   function login(email, password) {
//     return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
//       fetchUserData(userCredential.user.uid).then((userData) => {
//         setCurrentUser({ ...userCredential.user, ...userData });
//       });
//     });
//   }

//   function resetPassword(email) {
//     return sendPasswordResetEmail(auth, email);
//   }

//   function fetchUserData(uid) {
//     const userDocRef = doc(db, "users", uid);
//     return getDoc(userDocRef)
//       .then((docSnapshot) => {
//         if (docSnapshot.exists()) {
//           return docSnapshot.data();
//         } else {
//           console.log("No such document!");
//           return null;
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching user data:", error);
//         throw error;
//       });
//   }

//   function logout() {
//     return firebaseSignOut(auth);
//   }

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         fetchUserData(user.uid)
//           .then((userData) => {
//             setCurrentUser({ ...user, ...userData });
//             setLoading(false);
//           })
//           .catch((error) => {
//             console.error("Error fetching user data:", error);
//             setCurrentUser(user); // Fallback to basic user data
//             setLoading(false);
//           });
//       } else {
//         setCurrentUser(null);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const value = {
//     currentUser,
//     login,
//     resetPassword,
//     logout,
//     loading, // Expose loading state to the context
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
