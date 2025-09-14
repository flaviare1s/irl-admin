export const QuickStat = ({ icon, title, value }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="bg-primary/10 p-2 rounded-full">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <span className="text-lg font-bold text-primary">
        {value}
      </span>
    </div>
  )
}
