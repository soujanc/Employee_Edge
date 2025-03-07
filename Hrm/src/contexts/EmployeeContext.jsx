import React, { createContext, useReducer, useEffect } from "react";
import { empReducer, initialState } from "../reducer/Ereducer";
import { firestore } from "../services/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  query,
  orderBy
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { Constants } from "../constants/Constants";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(empReducer, initialState);
  const { currentUser } = useAuth();

  const calculateEmployeeStats = (employees) => {
    // console.log(employees)
    
  const numberOfEmployees = employees.length;
  const { totalSalary, maleCount, femaleCount, otherCount } = employees.reduce((acc, emp) => {
    const salary = parseFloat(emp.professionalInfo?.salary);
    const gender = emp.personalInfo?.gender?.toLowerCase();

    return {
      totalSalary: acc.totalSalary + (isNaN(salary) ? 0 : salary),
      maleCount: gender === 'male' ? acc.maleCount + 1 : acc.maleCount,
      femaleCount: gender === 'female' ? acc.femaleCount + 1 : acc.femaleCount,
      otherCount: gender === 'others' ? acc.otherCount + 1 : acc.otherCount,
    };
  }, 
  { totalSalary: 0, 
    maleCount: 0, 
    femaleCount: 0, 
    otherCount: 0 });

  const averageSalary = parseFloat(numberOfEmployees > 0 ? (totalSalary / numberOfEmployees).toFixed(2) : 0);

  // console.log(numberOfEmployees, averageSalary, totalSalary, maleCount, femaleCount, otherCount);

  dispatch({
    type: "SET_EMPLOYEE_STATS",
    payload: {
      numberOfEmployees,
      averageSalary,
      totalSalary,
      maleCount,
      femaleCount,
      otherCount,
    },
  });
  };

  useEffect(() => {
      const empCollectionRef = collection(firestore, "employee");
      const queryRef = query(empCollectionRef, orderBy("personalInfo.firstName"));
      const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const employees = [];
      snapshot.forEach((doc) => {
      employees.push({ id: doc.id, ...doc.data() });
        });
        dispatch({ type: "SET_EMPLOYEES", payload: employees });
        calculateEmployeeStats(employees);
      });
      return () => unsubscribe();
  },
[]
);
  useEffect(() => {
    if (!currentUser) {
      // console.log('No current user found');
      return;
    }
  
    const empCollectionRef = collection(firestore, "employee");
    const docRef = doc(empCollectionRef, '3bJcAzELucQPXukpF2q1');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const employee = snapshot.data();
      // console.log(employee);
      dispatch({ type: Constants.SET_CURRENT_EMPLOYEE, payload: employee });
    });
    return () => unsubscribe();
  },[currentUser]);

  const addEmp = async (emp,empId) => {
    try {
      const empCollectionRef = collection(firestore, "employee");
      const empDocRef = doc(firestore, "employee", empId); 
      await setDoc(empDocRef, emp);
      // dispatch({ type: "ADD_EMPLOYEE", payload: { id: empId, ...emp } });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const deleteEmp = async (id) => {
    try {
      const empDoc = doc(firestore, "employee", id);
      await deleteDoc(empDoc);
      dispatch({ type: "DELETE_EMPLOYEE", payload: id });
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const updateEmp = async (data, id) => {
    try {
      const docRef = doc(firestore, "employee", id);
      await setDoc(docRef, data, { merge: true });
      // dispatch({ type: "SET_EMPLOYEES", payload: { id, data } });
    } catch (error) {
      console.error("Error updating employee data:", error);
    }
  };

  return (
    <EmployeeContext.Provider value={{ state, addEmp, deleteEmp, updateEmp }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContext;
