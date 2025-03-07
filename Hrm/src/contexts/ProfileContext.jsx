import React, { createContext, useReducer, useEffect } from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { firestore } from '../services/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { profileReducer,initialState } from "../reducer/ProfileReducer";
import { useAuth } from "../hooks/useAuth";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
 
  const [state, dispatch] = useReducer(profileReducer, initialState);
 

  
  const { currentUser } = useAuth();
 

  useEffect(() => {
    if (!currentUser) {
      // console.log("No current user logged in.");
      return;
    }

    const employeeId = currentUser.uid;
    const docRef = doc(firestore, "employee", employeeId);

    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        dispatch({ type: "SET_PROFILE_DATA", payload: docSnapshot.data() });
      } else {
        // console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, [currentUser, dispatch]);

  const updateProfileData = async ( data) => {
    try {
      const employeeId = currentUser.uid;

      const docRef = doc(firestore, "employee", employeeId);
      await setDoc(docRef, data, { merge: true });
      dispatch({ type: "SET_PROFILE_DATA", payload: data });
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  };

  const updateProfileImage = async ( file) => {
    const employeeId = currentUser.uid;
    const storageInstance = getStorage();
    const photoRef = ref(storageInstance, `Emp_photo/${file.name + v4()}`);
    const uploadTask = uploadBytesResumable(photoRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const docRef = doc(firestore, "employee", employeeId);
            await setDoc(docRef, { personalInfo: { photo: downloadURL } }, { merge: true });
            dispatch({ type: "SET_PROFILE_IMAGE", payload: downloadURL });
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  return (
    <ProfileContext.Provider value={{ state,updateProfileImage, updateProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};
