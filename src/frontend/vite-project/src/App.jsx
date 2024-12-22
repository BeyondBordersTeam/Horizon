import React from 'react'
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import UserAuth from './pages/UserAuth'
import UniversityAuth from './pages/UniversityAuth'
import UserDashboard from './pages/userDashboard.jsx'
import UniversityDashboard from './pages/universityDashboard.jsx' // Make sure this page exists

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>

        {/* User Authentication Routes */}
        <Route path="/auth/user/login" element={<UserAuth/>}/>
        <Route path="/auth/user/signup" element={<UserAuth/>}/>

        {/* University Authentication Routes */}
        <Route path="/auth/university/login" element={<UniversityAuth/>}/>
        <Route path="/auth/university/signup" element={<UniversityAuth/>}/>

        {/* Dashboard Route */}
        <Route path="/dashboard/user" element={<UserDashboard/>}/>
        <Route path="/dashboard/university" element={<UniversityDashboard/>}/>


        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </Router>
  )
}

export default App
