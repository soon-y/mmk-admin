import { useState } from "react"
import type { CategoryProps } from "../../types"
import { PenBox, SquareCheckBig } from "lucide-react"

export default function CategoryName({ name, id, setArray }: { name: string, id: number, setArray: React.Dispatch<React.SetStateAction<CategoryProps[]>> }) {
  const [catName, setName] = useState<string>(name)
  const [editable, setEditable] = useState<boolean>(false)

  const updateName = () => {
    setEditable(false)
    setArray(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, name: catName }
        } else {
          return item
        }
      })
    )
  }

  return (
    <div>
      {editable ?
        <div className="flex">
          <SquareCheckBig onClick={updateName} className="w-5 mr-2 cursor-pointer text-gray-400 animate-bounce" />
          <input
            type="text"
            value={catName}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent outline-none w-full text-gray-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') { updateName() }
            }}
          />
        </div>
        :
        <div className="flex" onClick={() => setEditable(true)} >
          <PenBox className="w-4 mr-2 cursor-pointer" />
          <p>{catName}</p>
        </div>
      }
    </div>
  )
}
