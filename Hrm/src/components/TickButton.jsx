export const TickButton = ({ label , children }) => {
    return (
        <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
        <input className="mr-1" type="checkbox" />
        {label}  {children}
      </label>
    )
  }