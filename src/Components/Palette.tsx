import { useEffect, useState } from "react"

export function Palette({ initial, index, setColorArray, setColorHex }: {
  index: number,
  initial: string,
  setColorArray: React.Dispatch<React.SetStateAction<string[]>>,
  setColorHex: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const palette: string[] = ['#ffffff', '#000000', '#e3007f', '#00a0e8', '#ffef00']
  const colors: string[] = ['White', 'Black', 'Magenta', 'Blue', 'Yellow']
  const [colorIndex, setColorIndex] = useState<number>(palette.indexOf(initial))

  useEffect(() => {
    setColorHex(prev =>
      prev.map((item, i) => i === index ? palette[colorIndex] : item)
    )

    setColorArray(prev =>
      prev.map((item, i) => i === index ? colors[colorIndex] : item)
    )
  }, [colorIndex])

  return (
    <div className="flex gap-1 cursor-pointer">
      <div onClick={() => setColorIndex(0)} className={`${colorIndex === 0 ? 'border-gray-700' : 'border-gray-300 opacity-50'} rounded-full border border-2 w-5 h-5 bg-white`}></div>
      <div onClick={() => setColorIndex(1)} className={`${colorIndex === 1 ? 'border-gray-700' : 'border-gray-300 opacity-50'} rounded-full border border-2 w-5 h-5 bg-black`}></div>
      <div onClick={() => setColorIndex(2)} className={`${colorIndex === 2 ? 'border-gray-700' : 'border-gray-300 opacity-50'} rounded-full border border-2 w-5 h-5 bg-[#e3007f]`}></div>
      <div onClick={() => setColorIndex(3)} className={`${colorIndex === 3 ? 'border-gray-700' : 'border-gray-300 opacity-50'} rounded-full border border-2 w-5 h-5 bg-[#00a0e8]`}></div>
      <div onClick={() => setColorIndex(4)} className={`${colorIndex === 4 ? 'border-gray-700' : 'border-gray-300 opacity-50'} rounded-full border border-2 w-5 h-5 bg-[#ffef00]`}></div>
    </div>
  )
}