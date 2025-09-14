export const StatiticCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
        </div>
        <div className="bg-primary p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  )
}
