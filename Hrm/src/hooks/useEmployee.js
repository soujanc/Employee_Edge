import { useContext } from 'react';
import EmployeeContext from '../contexts/EmployeeContext';

export const useEmployee = () => {
  const { state, addEmp, deleteEmp,updateEmp } = useContext(EmployeeContext);

  return {
    empl: state.empl,
    currentEmployee: state.currentEmployee,
    numberOfEmployees: state.numberOfEmployees,
    totalSalary: state.totalSalary,
    averageSalary: state.averageSalary,
    maleCount: state.maleCount,
    femaleCount: state.femaleCount,
    otherCount: state.otherCount,
    loading: state.loading,
    error: state.error,
    addEmp,
    deleteEmp,
    updateEmp
  };
};
