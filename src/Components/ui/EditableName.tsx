import { useState, useEffect } from "react"
import { PenBox, SquareCheckBig, MinusCircle } from "lucide-react"

export default function EditableName({ 
  name, id, arrayLength, setArray, setDeletedIndex
 }: { 
  name: string, id: number, arrayLength: number, 
  setArray: React.Dispatch<React.SetStateAction<string[]>>
  setDeletedIndex: React.Dispatch<React.SetStateAction<number | null>>
 }) {
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
    setDeletedIndex(id)
    setArray(prev => prev.filter((_, i) => i !== id))
  }

  return (
    <div>
      {editable ?
        <div className="flex items-center">
          <div className="flex">
            <SquareCheckBig onClick={updateName} className="w-4 mr-2 cursor-pointer text-gray-400 animate-bounce" />
            <input style={{ width: `${newValue.length * 1.3 || 1}ch` }}
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="outline-none text-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') { updateName() }
              }}
            />
          </div>
        </div>
        :
        <div className="flex gap-2 items-center" >
          <div className="flex" onClick={() => setEditable(true)}>
            <PenBox className="w-4 mr-2 cursor-pointer" />
            <p>{newValue}</p>
          </div>
          {arrayLength > 1 && <MinusCircle className="inline w-5 text-red-500 cursor-pointer" strokeWidth={1} onClick={deleteArray} />}
        </div>
      }
    </div>
  )
}
