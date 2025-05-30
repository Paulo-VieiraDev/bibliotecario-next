import Image from "next/image"

interface TechCardProps {
  title: string
  description: string
  iconSrc: string
  bgSrc: string
  gradientFrom: string
  gradientVia: string
}

export function TechCard({
  title,
  description,
  iconSrc,
  bgSrc,
  gradientFrom,
  gradientVia
}: TechCardProps) {
  return (
    <div className="relative w-full max-w-64 h-80 rounded-2xl shadow-lg overflow-hidden flex flex-col items-center bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out">
      <div className="w-full h-full absolute inset-0">
        <Image src={bgSrc} alt={`${title} Background`} fill className="object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientFrom} ${gradientVia} to-transparent`} />
      </div>
      <div className="relative flex flex-col items-center justify-start w-full h-full z-10 pt-8 px-6">
        <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-white/80 shadow-lg">
          <Image src={iconSrc} alt={`${title} Logo`} width={40} height={40} />
        </div>
        <h4 className="text-white text-xl font-bold mb-2 text-center drop-shadow-lg">{title}</h4>
        <p className="text-white text-sm text-center drop-shadow-lg">{description}</p>
      </div>
    </div>
  )
} 