import Category from "../Components/Category"
import { UserPen } from "lucide-react"

function Settings() {

  return (
    <div className="container p-8">
      <div>
        <UserPen className="inline mr-2 w-5" />
        <span className="font-bold">Members</span>
      </div>

      <div>
        <Category />
      </div>
    </div>
  )
}

export default Settings
