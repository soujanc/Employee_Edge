// src/hooks/useAttendance.js
import { useContext } from 'react';
import { AttendanceContext } from '../contexts/AttendanceContext';

const useAttendance = () => {
    return useContext(AttendanceContext);
};

export default useAttendance;
