import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '', surname: '', sex: '', day: '', month: '', year: '', email: '', password: '',
  })

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/auth/user/login') {
      setIsLogin(true)
      setFormData((prev) => ({
        ...prev, email: location.state?.email || '', password: '',
      }))
    } else if (location.pathname === '/auth/user/signup') {
      setIsLogin(false)
      setFormData({
        name: '', surname: '', sex: '', day: '', month: '', year: '', email: '', password: '',
      })
    }
  }, [location.pathname, location.state])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const birth_date = `${formData.year}-${formData.month}-${formData.day}`

    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup'

    console.log('URL: ', url)

    const body = isLogin ? {email: formData.email, password: formData.password, role: 'user'} : {
      name: formData.name,
      surname: formData.surname,
      sex: formData.sex,
      birth_date,
      email: formData.email,
      password: formData.password,
      role: 'user',
    }

    try {
      const response = await fetch(url, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        if (isLogin) {
          toast.success('Login successful!', {autoClose: 1000})
          localStorage.setItem('token', data.token)
          setTimeout(() => navigate('/dashboard/user'), 1000)
        } else {
          toast.success('Signup successful! Please log in.', {autoClose: 1000})
          setTimeout(() => navigate('/auth/user/login', {state: {email: formData.email}}), 1000)
        }
      } else {
        console.log('BODY: ', body)
        toast.error(data.message || 'Something went wrong!')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred. Please try again.')
    }
  }

  const toggleMode = () => {
    if (isLogin) {
      navigate('/auth/user/signup')
    } else {
      navigate('/auth/user/login')
    }
  }

  return (<div style={styles.container}>
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>{isLogin ? 'User Login' : 'User Signup'}</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        {!isLogin && (<>
          <input
            type="text"
            name="name"
            placeholder="Name"
            style={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            style={styles.input}
            value={formData.surname}
            onChange={handleChange}
            required
          />
          <select
            name="sex"
            style={styles.input}
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value="">Select Sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div style={styles.birthDateContainer}>
            <select name="day" value={formData.day} onChange={handleChange} required style={styles.inputSmall}>
              <option value="">Day</option>
              {[...Array(31).keys()].map((d) => (<option key={d + 1} value={d + 1}>
                {d + 1}
              </option>))}
            </select>
            <select name="month" value={formData.month} onChange={handleChange} required style={styles.inputSmall}>
              <option value="">Month</option>
              {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m, idx) => (
                <option key={idx} value={m}>
                  {m}
                </option>))}
            </select>
            <select name="year" value={formData.year} onChange={handleChange} required style={styles.inputSmall}>
              <option value="">Year</option>
              {[...Array(100).keys()].map((y) => (<option key={y} value={2024 - y}>
                {2024 - y}
              </option>))}
            </select>
          </div>
        </>)}
        <input
          type="email"
          name="email"
          placeholder="Email"
          style={styles.input}
          value={formData.email}
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
        <button type="submit" style={styles.button}>{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p style={styles.text}>
        {isLogin ? 'Don\'t have an account? ' : 'Already have an account? '}
        <span onClick={toggleMode} style={styles.link}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
      </p>
    </div>
    <ToastContainer position="top-center" autoClose={1000} hideProgressBar closeOnClick pauseOnHover={false}/>
  </div>)
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f9'
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '350px',
    textAlign: 'center'
  },
  heading: {fontSize: '1.8rem', marginBottom: '20px', color: '#333'},
  form: {display: 'flex', flexDirection: 'column', gap: '15px'},
  input: {padding: '10px', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '5px'},
  inputSmall: {padding: '8px', fontSize: '0.9rem', border: '1px solid #ddd', borderRadius: '5px', width: '32%'},
  button: {
    padding: '10px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  text: {fontSize: '0.9rem', color: '#666', marginTop: '15px'},
  link: {color: '#007BFF', fontWeight: 'bold', cursor: 'pointer'},
  birthDateContainer: {display: 'flex', justifyContent: 'space-between'},
}

export default UserAuth