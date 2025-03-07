
export const initialState = {
  employees: [],
  loading: true,
  error: null,
  userRole: null, 
};

export const LeaveReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_EMPLOYEES_SUCCESS':
      return { ...state, employees: action.payload, loading: false };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(employee => employee.id !== action.payload),
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
      case 'SET_USER_ROLE': // New action type to set user role
    return { ...state, userRole: action.payload };
    default:
      return state;
  }
};
