import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  borderColor?: string
  iconColor?: string
  bgColor?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  borderColor = "border-blue-500",
  iconColor = "text-blue-700",
  bgColor = "bg-blue-100"
}: FeatureCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border-b-4 ${borderColor} transform hover:scale-105 transition duration-300 ease-in-out`}>
      <div className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center mb-6 shadow-md`}>
        <Icon size={48} className={iconColor} />
      </div>
      <h4 className="text-2xl font-extrabold text-blue-700 mb-3 drop-shadow-sm">{title}</h4>
      <p className="text-gray-700 text-base leading-relaxed">{description}</p>
    </div>
  )
} 