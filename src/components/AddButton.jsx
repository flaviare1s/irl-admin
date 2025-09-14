export const AddButton = ({ icon, label }) => {
  return (
    <button className="bg-white hover:bg-primary hover:text-white transition-colors duration-200 border-2 border-primary text-primary p-6 rounded-lg shadow-sm flex items-center justify-center space-x-3 group cursor-pointer">
      {icon}
      <span className="text-lg font-semibold">{label}</span>
    </button>
  )
}
