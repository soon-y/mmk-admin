import { useEffect, useState } from "react"
import { Colorful } from '@uiw/react-color'

export function Palette({ index, initial, setColorHex }: { index: number, initial: string, setColorHex: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [color, setColor] = useState(initial)

   useEffect(() => {
    setColorHex(prev =>
      prev.map((item, i) => i === index ? color : item)
    )
  }, [color])

  return (
    <Colorful style={{ width:'100%' }} color={color} onChange={(color) => { setColor(color.hex) }}
    />
  );
}