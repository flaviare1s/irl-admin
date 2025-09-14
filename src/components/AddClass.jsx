import { Link } from "react-router-dom"

export const AddClass = ({ icon, label }) => {
  return (
    <Link to="/create-class" className="bg-white hover:bg-primary hover:text-white transition-colors duration-200 border-2 border-primary text-primary p-6 rounded-lg shadow-sm flex items-center justify-center space-x-3 group cursor-pointer w-full gap-2 font-semibold">
      {icon}
      {label}
    </Link>
  )
}
