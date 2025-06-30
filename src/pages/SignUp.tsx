import { useState } from 'react'
import axios from 'axios'
import { RectangleEllipsis, CircleUser, AtSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      const res = await axios.post('https://mmk-backend.onrender.com/auth/register', { name, email, password })
      if (res.status === 201 || res.status === 200) {
        navigate('/login')
      } else {
        setError('Unexpected response from server.')
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 401 && err.response?.data?.message === 'Email already registered') {
          setError('This email is already registered.')
        } else {
          setError('Something went wrong. Please try again.')
        }
      } else {
        setError('Unexpected error occurred.')
      }
    }
  }

  return (
    <div className='container flex flex-col justify-center items-center'>
      <p className='font-bold text-2xl mb-4'>SIGN UP</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-[400px]'>
        <div className='bg-white p-3 rounded-xl flex'>
          <CircleUser className='inline w-5 mr-2 text-gray-400' />
          <input className='w-[330px]' value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        </div>
        <div className='bg-white p-3 rounded-xl flex'>
          <AtSign className='inline w-5 mr-2 text-gray-400' />
          <input className='w-[330px]' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className='bg-white p-3 rounded-xl flex'>
          <RectangleEllipsis className='inline w-5 mr-2 text-gray-400' />
          <input className='w-[330px]' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>
        <div className='bg-white p-3 rounded-xl flex'>
          <RectangleEllipsis className='inline w-5 mr-2 text-gray-400' />
          <input className='w-[330px]' type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
        </div>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  )
}
