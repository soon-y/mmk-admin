import { Plus } from "lucide-react"

export default function PlusBtn({ onClick }: { onClick: () => void }) {
  return (
    <Plus className='cursor-pointer ml-2 inline bg-[#0091ff] text-white rounded-full p-1' onClick={onClick} />
  )
}