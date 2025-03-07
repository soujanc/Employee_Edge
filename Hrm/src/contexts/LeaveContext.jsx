import React, { createContext, useReducer, useEffect } from 'react';
import { firestore } from '../services/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where, getDoc } from 'firebase/firestore';
import { LeaveReducer, initialState } from '../reducer/LeaveReducer';
import { useAuth } from "../hooks/useAuth";

const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [state, dispatch] = useReducer(LeaveReducer, initialState);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const fetchUserRole = async () => {
      const employeeId = currentUser.uid;

      try {
        const userDoc = await getDoc(doc(firestore, 'employee', employeeId));
        const userRole = userDoc.data().role;
        
        dispatch({ type: 'SET_USER_ROLE', payload: userRole });

        let q;
        if (userRole === 'admin') {
          q = collection(firestore, 'leave');
        } else {
          q = query(collection(firestore, 'leave'), where('userID', '==', employeeId));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const employees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          dispatch({ type: 'FETCH_EMPLOYEES_SUCCESS', payload: employees });
        }, (error) => {
          dispatch({ type: 'SET_ERROR', payload: error.message });
        });

        return () => unsubscribe();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    fetchUserRole();
  }, [currentUser]);

  const fetchCurrentUserData = async () => {
    try {
      if (!currentUser) {
        throw new Error("Current user is not defined");
      }
      const employeeId = currentUser.uid;

      const userDoc = await getDoc(doc(firestore, 'employee', employeeId));
      return { userData: userDoc.data(), userId: userDoc.id };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return null;
    }
  };

  const addLeave = async (leave) => {
    // console.log("leave in context", leave);

    try {
      const leaveRef = collection(firestore, 'leave');
      await addDoc(leaveRef, leave);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const deleteLeave = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'leave', id));
      dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await updateDoc(doc(firestore, 'leave', id), { status });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const updateLeave = async (id, newData) => {
    try {
      await updateDoc(doc(firestore, 'leave', id), newData);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  return (
    <LeaveContext.Provider value={{ state, addLeave, deleteLeave, updateLeave, updateLeaveStatus, fetchCurrentUserData }}>
      {children}
    </LeaveContext.Provider>
  );
};

export default LeaveContext;
