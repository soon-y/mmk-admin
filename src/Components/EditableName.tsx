import { useState, useEffect } from "react"
import { PenBox, SquareCheckBig, MinusCircle } from "lucide-react"

export default function EditableName({ name, id, arrayLength, setArray }: { name: string, id: number, arrayLength: number, setArray: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [newValue, setNewValue] = useState<string>(name)
  const [editable, setEditable] = useState<boolean>(false)

  const updateName = () => {
    setEditable(false)
    setArray(prev =>
      prev.map((value, index) =>
        index === id ? newValue : value
      )
    )
  }

  useEffect(() => {
    setNewValue(name)
    setEditable(false)
  }, [name])

  const deleteArray = () => {
    setArray(prev => prev.filter((_, i) => i !== id))
  }

  return (
    <div>
      {editable ?
        <div className="flex justify-between items-center">
          <div className="flex">
            <SquareCheckBig onClick={updateName} className="w-4 mr-2 cursor-pointer text-gray-400 animate-bounce" />
            <input style={{ width: `${newValue.length * 1.5 || 1}ch` }}
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="outline-none text-gray-400 bg-black"
              onKeyDown={(e) => {
                if (e.key === 'Enter') { updateName() }
              }}
            />
          </div>
          {arrayLength > 1 && <MinusCircle className="w-5 text-gray-600 cursor-pointer" strokeWidth={1} onClick={deleteArray} />}
        </div>
        :
        <div className="flex justify-between items-center" >
          <div className="flex" onClick={() => setEditable(true)}>
            <PenBox className="w-4 mr-2 cursor-pointer" />
            <p>{newValue}</p>
          </div>
          {arrayLength > 1 && <MinusCircle className="w-5 text-gray-600 cursor-pointer" strokeWidth={1} onClick={deleteArray} />}
        </div>
      }
    </div>
  )
}
