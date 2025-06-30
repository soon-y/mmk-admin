import axios from 'axios'

export const fetchMe = async() => {
  const token = localStorage.getItem('token')
  if (!token) {
    return Promise.resolve(false)
  }

  return axios.get('https://mmk-backend.onrender.com/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      return res.data
    })
    .catch(() => {
      return false
    })
}

export const fetchMembers = async() => {
  return axios.get('https://mmk-backend.onrender.com/users')
    .then(res => {
      return res.data
    })
    .catch(() => {
      return false
    })
}