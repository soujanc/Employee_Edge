import React from 'react';

const Button2 = ({ label, onClick, disabled }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button2;
