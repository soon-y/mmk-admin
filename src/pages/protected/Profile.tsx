import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingBar from '../../Components/LoadingBar'
import { useAuth } from '../../context/auth'

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  useEffect(() => {
    if(user) setLoading(false)
  }, [user])

  const formatted = (data: string) => {
    if (!data) return 'Unknown'
    const date = new Date(data)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <div className='container flex flex-col justify-center items-center'>
      {loading ? (
        <LoadingBar />
      ) : user ? (
        <div className='flex flex-col items-center gap-1'>
          <h1 className='text-2xl font-bold'>Welcome, {user.name}</h1>
          <p>{user.email}</p>
          <img className='w-[50%] aspect-square rounded-full my-4' src={user.avatar_url} alt={`${user.name}'s avatar`} />
          <p>{user.admin ? 'Admin' : 'Member'}</p>
          <p>created on {formatted(user.created_at)}</p>
          <button className='my-4' onClick={logout}>Log out</button>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-3 w-full animate-pulse'>
          <h1 className='w-50 h-8 bg-gray-200 rounded-md'></h1>
          <div className='w-40 h-5 bg-gray-200 rounded-md'></div>
          <div className='w-[50%] aspect-square bg-gray-200 rounded-full'></div>
          <div className='w-20 h-5 bg-gray-200 rounded-md'></div>
          <div className='w-40 h-5 bg-gray-200 rounded-md'></div>
          <div className='px-5 py-2 bg-gray-200 rounded-md grid place-items-center text-white'>Log out</div>
        </div>
      )}
    </div>
  )
}
