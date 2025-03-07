import { useContext } from 'react';
import LeaveContext from '../contexts/LeaveContext';

export const useLeave = () => {
    const { state, addLeave,deleteLeave,updateLeave, updateLeaveStatus, fetchCurrentUserData } = useContext(LeaveContext);
    const { userRole } = state; // Destructure userRole from state

  return { state, addLeave, deleteLeave,updateLeave, updateLeaveStatus, fetchCurrentUserData, userRole}; // Return userRole along with other values
};
