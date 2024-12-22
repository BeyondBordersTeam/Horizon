import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UniversityAuth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    description: '',
    study_levels: '',
    study_fields: '',
    tuition_fee_min: '',
    tuition_fee_max: '',
    application_deadline: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    password: '',
  })

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/auth/university/login') {
      setIsLogin(true)
      setFormData((prev) => ({
        ...prev,
        contact_email: location.state?.email || '',
        password: '',
      }))
    } else if (location.pathname === '/auth/university/signup') {
      setIsLogin(false)
      setFormData({
        name: '',
        country: '',
        city: '',
        description: '',
        study_levels: '',
        study_fields: '',
        tuition_fee_min: '',
        tuition_fee_max: '',
        application_deadline: '',
        contact_email: '',
        contact_phone: '',
        website_url: '',
        password: '',
      })
    }
  }, [location.pathname, location.state])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/signup'

    const body = isLogin
      ? {email: formData.contact_email, password: formData.password, role: 'university'}
      : {...formData, role: 'university'}

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        if (isLogin) {
          toast.success('Login successful!', {autoClose: 1000})
          localStorage.setItem('token', data.token)
          localStorage.setItem('name', data.name)
          localStorage.setItem('university_id', data.id)
          setTimeout(() => navigate('/dashboard/university'), 1000) // Redirect after 1 second
        } else {
          toast.success('Signup successful! Please log in.', {autoClose: 1000})
          setTimeout(() => navigate('/auth/university/login', {state: {email: formData.contact_email}}), 1000)
        }
      } else {
        toast.error(data.message || 'Something went wrong!')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred. Please try again.')
    }
  }

  const toggleMode = () => {
    if (isLogin) {
      navigate('/auth/university/signup')
    } else {
      navigate('/auth/university/login')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>{isLogin ? 'University Login' : 'University Signup'}</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="University Name"
                style={styles.input}
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                style={styles.input}
                value={formData.country}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                style={styles.input}
                value={formData.city}
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                style={styles.input}
                value={formData.description}
                onChange={handleChange}
              />
              <input
                type="text"
                name="study_levels"
                placeholder="Study Levels (e.g., Bachelor, Master)"
                style={styles.input}
                value={formData.study_levels}
                onChange={handleChange}
              />
              <input
                type="text"
                name="study_fields"
                placeholder="Study Fields (e.g., Engineering, Medicine)"
                style={styles.input}
                value={formData.study_fields}
                onChange={handleChange}
              />
              <input
                type="number"
                name="tuition_fee_min"
                placeholder="Tuition Fee Min"
                style={styles.input}
                value={formData.tuition_fee_min}
                onChange={handleChange}
              />
              <input
                type="number"
                name="tuition_fee_max"
                placeholder="Tuition Fee Max"
                style={styles.input}
                value={formData.tuition_fee_max}
                onChange={handleChange}
              />
              <input
                type="date"
                name="application_deadline"
                placeholder="Application Deadline"
                style={styles.input}
                value={formData.application_deadline}
                onChange={handleChange}
              />
              <input
                type="text"
                name="contact_phone"
                placeholder="Contact Phone"
                style={styles.input}
                value={formData.contact_phone}
                onChange={handleChange}
              />
              <input
                type="text"
                name="website_url"
                placeholder="Website URL"
                style={styles.input}
                value={formData.website_url}
                onChange={handleChange}
              />
            </>
          )}
          <input
            type="email"
            name="contact_email"
            placeholder="Email"
            style={styles.input}
            value={formData.contact_email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.text}>
          {isLogin ? 'Don\'t have an account? ' : 'Already have an account? '}
          <span onClick={toggleMode} style={styles.link}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar closeOnClick pauseOnHover={false}/>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f9',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '400px',
    textAlign: 'center',
  },
  heading: {fontSize: '1.8rem', marginBottom: '20px', color: '#333'},
  form: {display: 'flex', flexDirection: 'column', gap: '15px'},
  input: {padding: '10px', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '5px'},
  button: {
    padding: '10px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#28A745',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  text: {fontSize: '0.9rem', color: '#666', marginTop: '15px'},
  link: {color: '#28A745', fontWeight: 'bold', cursor: 'pointer'},
}

export default UniversityAuth