import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Dashboard = () => {
  const [role, setRole] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user/dashboard', {
          headers: {Authorization: `Bearer ${token}`},
        })

        const data = await response.json()

        if (response.ok) {
          setMessage(data.message)
          setRole('user')
        } else {
          const universityRes = await fetch('http://localhost:5000/api/auth/university/dashboard', {
            headers: {Authorization: `Bearer ${token}`},
          })

          const universityData = await universityRes.json()

          if (universityRes.ok) {
            setMessage(universityData.message)
            setRole('university')
          }
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchDashboard()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    alert('You have been logged out.')
    navigate('/auth/login')
  }

  return (
    <div>
      <h2>Welcome to Your Dashboard</h2>
      <p>{message}</p>
      <p>You are logged in as <strong>{role}</strong>.</p> {/* Display role */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard