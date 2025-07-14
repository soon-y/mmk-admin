import { type ReactNode } from "react"
import { useAuth } from '../../context/auth'


export default function BtnForAdmin({ disabled, onClick, children, classname } : {
  disabled?: boolean
  onClick: () => Promise<void>
  children: ReactNode
  classname?: string
}) {
  const { user } = useAuth()

  const handleClick = async () => {
    if (!user?.admin) {
      alert("You are not authorized to perform this action.")
      return
    }
    await onClick()
  }

  return (
    <div className={`${classname}`}>
      <button type="button" disabled={disabled? disabled : false} onClick={handleClick} className="w-full uppercase">{children}</button>
    </div>
  )
}
