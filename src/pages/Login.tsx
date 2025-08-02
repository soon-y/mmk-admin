import { useState } from 'react'
import axios from 'axios'
import { RectangleEllipsis, CircleUser } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LoadingBar from '../Components/LoadingBar'
import { fetchMe } from '../utils/profileUtils'
import { useAuth } from '../context/auth'

export default function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { setUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const res = await axios.post('https://mmk-backend.onrender.com/auth/login', { email, password })
      if (res.status === 201 || res.status === 200) {
        localStorage.setItem('token', res.data.access_token)
        const userData = await fetchMe()

        if (userData && userData !== false) {
          setUser(userData)
          setLoading(false)
          navigate('/dashboard')
        }
      } else {
        setError('Unexpected response from server.')
      }
    } catch (err) {
      setLoading(false)
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 401) {
          if (err.response?.data?.message === 'User not found') setError('This email is not registered.')
          if (err.response?.data?.message === 'Invalid credentials') setError('Email or password is incorrect. Please try again.')
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
      <p className='font-bold text-2xl mb-4'>LOGIN</p>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-[400px]'>
        <div className='bg-white rounded-xl overflow-hidden border border-gray-300'>
          <CircleUser className='absolute m-2 w-5 mr-2 text-gray-400' />
          <input className='w-full w-[330px] outline-none py-2 pl-10' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>

        <div className='bg-white rounded-xl overflow-hidden border border-gray-300'>
          <RectangleEllipsis className='absolute m-2 w-5 mr-2 text-gray-400' />
          <input className='w-full w-[330px] outline-none py-2 pl-10'type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
        <button type="submit">Sign in</button>
      </form>

      <p className='my-4 cursor-pointer' onClick={() => navigate('/signup')}>Don't have an account? <strong>Resgister</strong></p>

      <div className="flex items-center w-[400px]">
        <hr className="flex-grow border-gray-300 mx-2" />
        <span className="text-gray-500">or</span>
        <hr className="flex-grow border-gray-300 mx-2" />
      </div>

      <div className='text-gray-500 p-4 my-2 rounded-md flex flex-col items-center'>
        Please use the following credentials: <br />
        <div><CircleUser className='inline w-5 mr-2' /> member@mmk.com </div>
        <div><RectangleEllipsis className='inline w-5 mr-2' />mmk123456789</div>
      </div>

      {loading && <LoadingBar />}
    </div>
  )
}
