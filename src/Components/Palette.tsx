import { useEffect } from "react"
import { ColorPicker, useColor } from "react-color-palette"
import "react-color-palette/css"

export function Palette({ index, initial, setColorHex }: { index: number, initial: string, setColorHex: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [color, setColor] = useColor(initial)

  useEffect(() => {
    setColorHex(prev =>
      prev.map((item, i) => i === index ? color.hex : item)
    )
  }, [color.hex, index])

  return (
    <>
      <ColorPicker height={40} hideInput={["rgb", "hsv", 'hex']} color={color} onChange={setColor} />
    </>)
}