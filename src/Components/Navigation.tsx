import { Boxes, PackagePlus, Truck, Settings, CircleUserRound } from "lucide-react"
import type { ReactNode } from "react"
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from "../context/auth"

function Navigation() {
  const { user } = useAuth()
  const location = useLocation()
  const menus: { link: string, label: string, icon: ReactNode }[] = [
    { link: 'products', label: 'Products', icon: <Boxes strokeWidth={1} /> },
    { link: 'new-product', label: 'New Product', icon: <PackagePlus strokeWidth={1} /> },
    { link: 'orders', label: 'Order', icon: <Truck strokeWidth={1} /> },
    { link: 'customers', label: 'Customers', icon: <CircleUserRound strokeWidth={1} /> },
    { link: 'settings', label: 'Settings', icon: <Settings strokeWidth={1} /> },
    { link: 'profile', label: 'Profile', icon: user ? <img className="w-6 rounded-full" src={user.avatar_url} /> : <div className="w-6 aspect-square bg-gray-200 rounded-full animate-pulse"></div> },
  ]

  const active = (path: string) => {
    return location.pathname.includes(path)
  }

  return (
    <div className='fixed border-r border-r-[#eeeeee] w-[200px] h-[100vh] bg-white p-4'>
      <Link to="/">
        <img src="/mmk-logo.png" className="m-auto w-[180px] mb-12" />
      </Link>
      {location.pathname !== '/login' && location.pathname !== '/signup'
        && menus.map(({ link, label, icon }, index) => (
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
