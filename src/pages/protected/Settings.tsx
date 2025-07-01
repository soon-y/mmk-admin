import { useEffect, useState } from "react"
import Category from "../../Components/Category"
import { Users } from "lucide-react"
import type { UserProps } from "../../types"
import { fetchMembers } from "../../utils/profileUtils"

function Settings() {
  const [members, setMembers] = useState<UserProps[]>([])
  const styles = 'p-8 bg-white rounded-xl'

  useEffect(() => {
    fetchMembers().then((res) => {
      setMembers(res)
    })
  }, [])

  return (
    <div className="container p-8 flex flex-col gap-6">
      <div className={styles}>
        <Users className="inline mr-2 w-5" />
        <span className="font-bold">Members</span>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((member, index) => (
            <div key={index} className="flex mt-4">
              <img className="w-16 rounded-full" src={member.avatar_url} />
              <div className="flex flex-col ml-4 justify-center">
                <strong>{member.name}</strong>
                <p className="text-sm">{member.email}</p>
                <p className="text-sm">{member.admin? 'Admin' : 'Member'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles}>
        <Category />
      </div>
    </div>
  )
}

export default Settings
