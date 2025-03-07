import { createContext, useReducer, useEffect } from 'react';
import { firestore } from "../services/firebase";
import { onSnapshot,doc,collection,addDoc,updateDoc,query,where,getDocs } from 'firebase/firestore';
import { attendanceReducer, initialState } from '../reducer/AttendanceReducer';
import { useAuth } from "../hooks/useAuth";
 
export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { currentUser } = useAuth();
 
    const [state, dispatch] = useReducer(attendanceReducer, initialState);
    useEffect(() => {const fetchEmployees = async () => {
     
    const empCollectionRef = collection(firestore, "employee");

    // Subscribe to changes in the entire collection
    const unsubscribe = onSnapshot(empCollectionRef, (snapshot) => {
        const employees = [];
        snapshot.forEach((doc) => {
        employees.push({ id: doc.id, ...doc.data() });
    });
    dispatch({ type: "SET_EMPLOYEES", payload: employees });
    
    });
    return () => unsubscribe();
};
const fetchAttendance = async () => {
    const attendanceCollectionRef = collection(firestore, "attendance");

    // Subscribe to changes in the attendance collection
    const unsubscribeAttendance = onSnapshot(attendanceCollectionRef, (snapshot) => {
        const attendanceData = {};
        snapshot.forEach((doc) => {
        const data = doc.data();
        if (!attendanceData[data.userId]) {
        attendanceData[data.userId] = {};
        }
        attendanceData[data.userId][data.date] = data.attendance;
    });
    dispatch({ type: 'SET_ATTENDANCE1', payload: attendanceData });
    });

    return () => unsubscribeAttendance();
};

fetchEmployees();
fetchAttendance();
}, []);

const markAttendance = async (employeeId, employeeName, date, status) => {
  try {
    const attendanceCollectionRef = collection(firestore, "attendance");
    const q = query(attendanceCollectionRef, where("userId", "==", employeeId), where("date", "==", date));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update existing document
      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(firestore, "attendance", docSnapshot.id);
        await updateDoc(docRef, { attendance: status });
      });
    } else {
      // Add new document
      const attendance = {
        userId: employeeId,
        userName: employeeName,
        date: date,
        attendance: status
      };
      await addDoc(attendanceCollectionRef, attendance);
    }
  } catch (error) {
    console.error("Error ", error);
  }
    dispatch({
      type: 'MARK_ATTENDANCE',
      payload: { employeeId, date, status }
    });
  };

  const getAttendanceData = async () => {
    try {
      const employeeId = currentUser.uid;
      
      const date = new Date().toISOString().split('T')[0];
    // console.log("date", date);
      
      const attendanceCollectionRef = collection(firestore, "attendance");
      const q = query(attendanceCollectionRef,  where("userId", "==", employeeId), where("date", "==", date));
      const querySnapshot = await getDocs(q);
      // console.log("emp",querySnapshot)
      if (!querySnapshot.empty) {
        // Create an array to hold the attendance data
        const attendanceData = [];
  
        // Loop through the query results and extract the data
        querySnapshot.forEach((docSnapshot) => {
          attendanceData.push(docSnapshot.data());
        });
  
        return attendanceData;
      } else {
        // If no documents found, return an empty array
        return [];
      }
    } catch (error) {
      console.error("Error retrieving attendance data: ", error);
      return null;
    }
  };

  return (
    <AttendanceContext.Provider value={{ ...state, markAttendance ,getAttendanceData}}>
      {children}
    </AttendanceContext.Provider>
  );
};

