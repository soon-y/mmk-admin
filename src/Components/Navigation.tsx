import { Boxes, PackagePlus, Truck, Settings } from "lucide-react"
import type { ReactNode } from "react"
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()
  const menus: { link: string, label: string, icon: ReactNode }[] = [
    { link: 'products', label: 'products', icon: <Boxes strokeWidth={1} /> },
    { link: 'new-product', label: 'new product', icon: <PackagePlus strokeWidth={1} /> },
    { link: 'orders', label: 'order', icon: <Truck strokeWidth={1} /> },
    { link: 'settings', label: 'settings', icon: <Settings strokeWidth={1} /> },
  ]

  const active = (path: string) => {
    return location.pathname.includes(path)
  }

  return (
    <div className='fixed border-r border-r-[#eeeeee] w-[200px] h-[100vh] bg-white p-4'>
      <Link to="/">
        <img src="/mmk-logo.png" className="m-auto w-[180px] mb-12" />
      </Link>
      {menus.map(({ link, label, icon }, index) => (
        <Link to={link} key={index}>
          <div className={`${active(link) ? 'text-[#e600b2]' : 'text-gray-600'} flex items-center space-x-2 py-2 my-1 hover:text-[#00d1ff] cursor-pointer duration-500`}>
            {icon}
            <span>{label}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Navigation
