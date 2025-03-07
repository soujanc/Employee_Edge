

import { Constants } from "../constants/Constants";


export const initialState = {
  empl: [],
  numberOfEmployees: 0,
  totalSalary: 0,
  averageSalary: 0,
  maleCount: 0,
  femaleCount: 0,
  otherCount: 0,
  currentEmployee: null,
  loading: true,
  error: null
};

export const empReducer = (state, action) => {
  switch (action.type) {
    case "SET_EMPLOYEES":
      return {
        ...state,
        empl: action.payload,
        loading: false,
      };
      case "SET_EMPLOYEE_STATS":
      return {
        ...state,
        numberOfEmployees: action.payload.numberOfEmployees,
        totalSalary: action.payload.totalSalary,
        averageSalary: action.payload.averageSalary,
        maleCount: action.payload.maleCount,
        femaleCount: action.payload.femaleCount,
        otherCount: action.payload.otherCount,

      };
      case Constants.SET_CURRENT_EMPLOYEE:
        return {
          ...state,
          empl: [...state.empl],
          currentEmployee: action.payload,
          loading: false,
          error: null
        };
    case "ADD_EMPLOYEE":
      return {
        ...state,
        empl: [...state.empl, action.payload],
        loading: false,
        
      };
    case "DELETE_EMPLOYEE":
      return {
        ...state,
        empl: state.empl.filter(emp => emp.id !== action.payload),
        loading: false,
        error: null
      };
    case "UPDATE_EMPLOYEE":
      return {
        ...state,
        empl: state.empl.map(emp =>
          emp.id === action.payload.id ? {...emp,...action.payload.values}
        :emp
      ),
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

