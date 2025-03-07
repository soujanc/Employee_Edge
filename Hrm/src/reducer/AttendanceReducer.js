
export const initialState = {
    employees: [],
    attendanceData: {},
    loading: true
  };
  
export const attendanceReducer = (state, action) => {
    switch (action.type) {
      case 'SET_EMPLOYEES':
        return { ...state, employees: action.payload, loading: false };
      case 'SET_ATTENDANCE1':
        return { ...state, attendanceData: action.payload };
      case 'MARK_ATTENDANCE':
        return {
          ...state,
          attendanceData: {
            ...state.attendanceData,
            [action.payload.employeeId]: {
              ...state.attendanceData[action.payload.employeeId],
              [action.payload.date]: action.payload.status
            }
          }
        };
      default:
        return state;
    }
  };
  