import React, {useEffect, useState} from 'react'
import './universityDashboard.css'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UniversityDashboard = () => {
  const [programs, setPrograms] = useState([])
  const [universityName, setUniversityName] = useState('')
  const [loading, setLoading] = useState(false)
  const [newProgram, setNewProgram] = useState({
    name: '',
    study_field: '',
    study_level: '',
    tuition_fee_min: '',
    tuition_fee_max: '',
    description: '',
    application_deadline: '',
  })
  const [editingProgram, setEditingProgram] = useState(null)

  useEffect(() => {
    const storedUniversityName = localStorage.getItem('name')
    if (storedUniversityName) {
      setUniversityName(storedUniversityName)
    }
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    const token = localStorage.getItem('token')
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/university/programs', {
        headers: {Authorization: `Bearer ${token}`},
      })
      const data = await response.json()
      setPrograms(data)
    } catch (error) {
      console.error('Error fetching programs:', error)
      toast.error('Failed to fetch programs. Please try again.')

    } finally {
      setLoading(false)
    }
  }

  const handleAddProgram = async () => {
    const token = localStorage.getItem('token')
    const university_id = localStorage.getItem('university_id')
    try {
      const response = await fetch('http://localhost:5000/api/university/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({...newProgram, university_id}),
      })

      const data = await response.json()
      if (response.ok) {
        setPrograms((prevPrograms) => [...prevPrograms, data])
        setNewProgram({
          name: '',
          study_field: '',
          study_level: '',
          tuition_fee_min: '',
          tuition_fee_max: '',
          description: '',
          application_deadline: '',
        })
        toast.success('Program added successfully!', {autoClose: 500})

        closeModal()
      } else {
        toast.error(`Error adding program: ${data}`)
      }
    } catch (error) {
      console.error('Error adding program:', error)
      toast.error('Failed to add program. Please try again.')
    }
  }

  const handleDeleteProgram = async (id) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:5000/api/university/programs/${id}`, {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${token}`},
      })
      if (response.ok) {
        setPrograms(programs.filter((program) => program.id !== id))
        toast.success('Program deleted successfully', {autoClose: 1000})
      } else {
        toast.error(data.message || 'Error deleting program')
      }
    } catch (error) {
      console.error('Error deleting program:', error)
      toast.error('Failed to delete program. Please try again.')
    }
  }

  const handleEditProgram = (program) => {
    setEditingProgram(program)
    setNewProgram(program)
    openModal()
  }

  const handleUpdateProgram = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:5000/api/university/programs/${editingProgram.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProgram),
      })
      if (response.ok) {
        const updatedPrograms = programs.map((program) =>
          program.id === editingProgram.id ? {...program, ...newProgram} : program
        )
        setPrograms(updatedPrograms)
        setEditingProgram(null)
        setNewProgram({
          name: '',
          study_field: '',
          study_level: '',
          tuition_fee_min: '',
          tuition_fee_max: '',
          description: '',
          application_deadline: '',
        })
        toast.success('Program updated successfully', {autoClose: 500})
        closeModal()
      } else {
        toast.error('Error updating program')
      }
    } catch (error) {
      console.error('Error updating program:', error)
      toast.error('Failed to update program. Please try again.')

    }
  }

  const openModal = () => {
    document.getElementById('add-program-modal').style.display = 'flex'
  }

  const closeModal = () => {
    document.getElementById('add-program-modal').style.display = 'none'
    setEditingProgram(null)
    setNewProgram({
      name: '',
      study_field: '',
      study_level: '',
      tuition_fee_min: '',
      tuition_fee_max: '',
      description: '',
      application_deadline: '',
    })
  }

  return (
    <div className="university-dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {universityName}</h1>
        <p>Manage your programs effectively.</p>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2>Programs</h2>
          <button onClick={openModal}>{editingProgram ? 'Edit Program' : 'Add Program'}</button>
          {loading ? (
            <p>Loading programs...</p>
          ) : (
            <ul>
              {programs.map((program) => (
                <li key={program.id}>
                  <h3>{program.name || 'Unnamed Program'}</h3>
                  <p>Field: {program.study_field || 'N/A'}</p>
                  <p>Level: {program.study_level || 'N/A'}</p>
                  <p>
                    Fees: {program.tuition_fee_min ? `$${program.tuition_fee_min}` : 'N/A'} -{' '}
                    {program.tuition_fee_max ? `$${program.tuition_fee_max}` : 'N/A'} USD/year
                  </p>
                  <p>Description: {program.description || 'No description available'}</p>
                  <p>Application Deadline: {program.application_deadline || 'Not specified'}</p>
                  <div>
                    <button onClick={() => handleEditProgram(program)}>Edit</button>
                    <button onClick={() => handleDeleteProgram(program.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div id="add-program-modal" className="modal">
        <div className="modal-content">
          <h2>{editingProgram ? 'Edit Program' : 'Add Program'}</h2>
          <input
            type="text"
            placeholder="Program Name"
            value={newProgram.name}
            onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
          />
          <input
            type="text"
            placeholder="Study Field"
            value={newProgram.study_field}
            onChange={(e) => setNewProgram({...newProgram, study_field: e.target.value})}
          />
          <input
            type="text"
            placeholder="Study Level"
            value={newProgram.study_level}
            onChange={(e) => setNewProgram({...newProgram, study_level: e.target.value})}
          />
          <input
            type="number"
            placeholder="Tuition Fee Min"
            value={newProgram.tuition_fee_min}
            onChange={(e) => setNewProgram({...newProgram, tuition_fee_min: e.target.value})}
          />
          <input
            type="number"
            placeholder="Tuition Fee Max"
            value={newProgram.tuition_fee_max}
            onChange={(e) => setNewProgram({...newProgram, tuition_fee_max: e.target.value})}
          />
          <textarea
            placeholder="Description"
            value={newProgram.description}
            onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
          />
          <input
            type="date"
            placeholder="Application Deadline"
            value={newProgram.application_deadline}
            onChange={(e) => setNewProgram({...newProgram, application_deadline: e.target.value})}
          />
          <div className="modal-actions">
            <button onClick={editingProgram ? handleUpdateProgram : handleAddProgram}>
              {editingProgram ? 'Update Program' : 'Add Program'}
            </button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={500} hideProgressBar closeOnClick pauseOnHover={false}/>
    </div>
  )
}

export default UniversityDashboard