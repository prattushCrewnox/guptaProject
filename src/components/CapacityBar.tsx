interface Props {
  percentage: number
}

export const CapacityBar = ({ percentage }: Props) => {
  let bgColor = "bg-green-500"
  if (percentage > 75) bgColor = "bg-red-500"
  else if (percentage > 50) bgColor = "bg-yellow-500"

  return (
    <div className="w-full bg-gray-200 rounded h-4">
      <div
        className={`h-full rounded ${bgColor}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
