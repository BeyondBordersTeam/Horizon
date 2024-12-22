import React from 'react'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const handleUser = () => {
    navigate('/auth/user/login')
  }

  const handleUniversity = () => {
    navigate('/auth/university/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome to EduNet Portal!</h1>
        <p style={styles.subHeading}>
          If you want to continue, please mention you want to login as a <strong>User</strong> or <strong>University</strong>
        </p>
        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
            onClick={handleUser}
          >
            User
          </button>
          <button
            style={{...styles.button, backgroundColor: '#28A745'}} // Green for University
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonGreenHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#28A745')}
            onClick={handleUniversity}
          >
            University
          </button>
        </div>
      </div>
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
    fontFamily: '\'Helvetica\', Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '500px',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '15px',
    color: '#333',
  },
  subHeading: {
    fontSize: '1rem',
    marginBottom: '25px',
    color: '#555',
    lineHeight: '1.5',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', 
  },
  buttonGreenHover: {
    backgroundColor: '#218838',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)', 
  },

}

export default Home