import { Loader } from "lucide-react"

export default function LoadingBar() {


  return (
    <div className="container fixed top-0 left-0 w-full h-full backdrop-blur-xs flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  )
}
