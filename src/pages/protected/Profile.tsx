import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingBar from '../../Components/LoadingBar'
import { fetchMe } from '../../utils/profileUtils'
import type { UserProps } from '../../types'

export default function Profile() {
  const [user, setUser] = useState<UserProps>()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMe().then((result) => {
      if (result === false) {
        navigate('/login')
      } else {
        setUser(result)
        setLoading(false)
      }
    })
  }, [])

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
    navigate('/login')
  }

  return (
    <div className='container flex flex-col justify-center items-center'>
      {loading ? (
        <LoadingBar />
      ) : user ? (
        <div className='flex flex-col items-center gap-1'>
          <h1 className='text-2xl font-bold'>Welcome, {user.name}</h1>
          <img className='w-[50%] aspect-square rounded-full my-4' src={user.avatar_url} alt={`${user.name}'s avatar`} />
          <p>{user.email}</p>
          <p>Created at {formatted(user.created_at)}</p>
          <button className='my-4' onClick={logout}>Log out</button>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-5 w-full'>
          <h1 className='w-50 h-8 bg-gray-200 rounded-md'></h1>
          <div className='w-[50%] aspect-square bg-gray-200 rounded-full'></div>
          <div className='w-40 h-6 bg-gray-200 rounded-md'></div>
          <div className='w-40 h-6 bg-gray-200 rounded-md'></div>
        </div>
      )}
    </div>
  )
}
