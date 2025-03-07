export const CancelButton = ({onClick, label }) => {
    return (
      <div className="text-center md:text-left">
          <button 
          onClick={onClick}
          className="mt-2 bg-gray-400 hover:bg-gray-600 px-4 py-2 text-white uppercase rounded text-xs tracking-wider cursor-pointer"
          >
          {label}
          </button>
      </div>
    )
  }