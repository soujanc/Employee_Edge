// FilledButton component
export const FilledButton = ({ onClick, label, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider cursor-pointer"
    >
      {label}
    </button>
  );
};
