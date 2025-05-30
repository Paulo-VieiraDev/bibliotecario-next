import { LucideIcon } from "lucide-react"

interface BenefitCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-800">
        <Icon size={32} />
      </div>
      <h4 className="text-xl font-extrabold mb-2 text-blue-800 text-center">{title}</h4>
      <p className="text-gray-700 text-base text-center">{description}</p>
    </div>
  )
} 