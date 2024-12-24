import React, {useEffect, useState} from 'react'
import './userDashboard.css'

const UserDashboard = () => {
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    studyLevel: '',
    cost: [0, 50000],
    field: '',
  })

  const [universities, setUniversities] = useState([])
  const [filteredUniversities, setFilteredUniversities] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUniversity, setSelectedUniversity] = useState(null) // For details view
  const universitiesPerPage = 6

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/universities') // Update URL as per your backend
        const data = await response.json()
        setUniversities(data)
        setFilteredUniversities(data) // Initially show all universities
      } catch (error) {
        console.error('Error fetching universities:', error)
      }
    }

    fetchUniversities()
  }, [])

  const handleFilterChange = (e) => {
    const {name, value} = e.target
    setFilters({...filters, [name]: value})
  }

  const applyFilters = () => {
    const filtered = universities.filter((university) => {
      const matchesCountry = filters.country
        ? university.country.toLowerCase().includes(filters.country.toLowerCase())
        : true
      const matchesCity = filters.city
        ? university.city.toLowerCase().includes(filters.city.toLowerCase())
        : true
      const matchesStudyLevel = filters.study_levels
        ? university.study_levels.toLowerCase().includes(filters.studyLevel.toLowerCase())
        : true
      const matchesField = filters.field
        ? university.study_fields.toLowerCase().includes(filters.field.toLowerCase())
        : true
      const matchesCost =
        university.tuition_fee_min >= filters.cost[0] &&
        university.tuition_fee_max <= filters.cost[1]

      return matchesCountry && matchesCity && matchesStudyLevel && matchesField && matchesCost
    })

    setFilteredUniversities(filtered)
    setCurrentPage(1) // Reset to the first page
  }

  const indexOfLastUniversity = currentPage * universitiesPerPage
  const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage
  const currentUniversities = filteredUniversities.slice(
    indexOfFirstUniversity,
    indexOfLastUniversity
  )

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUniversities.length / universitiesPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Render the university details view
  const renderUniversityDetails = () => (
    <div className="university-details">
      <h2>{selectedUniversity.name}</h2>
      <p><strong>Location:</strong> {selectedUniversity.city}, {selectedUniversity.country}</p>
      <p><strong>Description:</strong> {selectedUniversity.description}</p>
      <p><strong>Study Levels:</strong> {selectedUniversity.study_levels}</p>
      <p><strong>Fields:</strong> {selectedUniversity.study_fields}</p>
      <p><strong>Tuition
        Fees:</strong> {selectedUniversity.tuition_fee_min} - {selectedUniversity.tuition_fee_max} USD/year</p>
      <p><strong>Application Deadline:</strong> {selectedUniversity.application_deadline}</p>
      <p><strong>Contact Email:</strong> {selectedUniversity.contact_email}</p>
      <p><strong>Contact Phone:</strong> {selectedUniversity.contact_phone}</p>
      <p><strong>Website:</strong> <a href={selectedUniversity.website_url} target="_blank"
                                      rel="noopener noreferrer">{selectedUniversity.website_url}</a></p>
      <button className="back-button" onClick={() => setSelectedUniversity(null)}>
        Back to List
      </button>
    </div>
  )

  return (
    <div className="dashboard-container">
      {/* Filters Section */}
      {!selectedUniversity && (
        <aside className="filters-container">
          <h3>Search Filters</h3>
          <div className="filter-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Enter country"
              value={filters.country}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Enter city"
              value={filters.city}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="studyLevel">Study Level</label>
            <select
              id="studyLevel"
              name="studyLevel"
              value={filters.studyLevel}
              onChange={handleFilterChange}
            >
              <option value="">Select</option>
              <option value="Bachelor’s">Bachelor’s</option>
              <option value="Master’s">Master’s</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="cost">Cost (USD)</label>
            <input
              type="range"
              id="cost"
              name="cost"
              min="0"
              max="100000"
              value={filters.cost[1]}
              onChange={(e) =>
                setFilters({...filters, cost: [0, parseInt(e.target.value)]})
              }
            />
            <p>Up to {filters.cost[1]} USD/year</p>
          </div>
          <div className="filter-group">
            <label htmlFor="field">Study Field</label>
            <input
              type="text"
              id="field"
              name="field"
              placeholder="Enter study field"
              value={filters.field}
              onChange={handleFilterChange}
            />
          </div>
          <button onClick={applyFilters} className="apply-filters-button">
            Apply Filters
          </button>
        </aside>
      )}

      {/* Main Content */}
      <section className="universities-container">
        {selectedUniversity ? (
          renderUniversityDetails()
        ) : (
          <>
            <h2>Universities</h2>
            <div className="universities-grid">
              {currentUniversities.map((university) => (
                <div className="university-card" key={university.id}>
                  <h3>{university.name}</h3>
                  <p>{university.city}, {university.country}</p>
                  <p>Study Levels: {university.study_levels}</p>
                  <p>Fields: {university.study_fields}</p>
                  <p>Cost: {university.tuition_fee_min} - {university.tuition_fee_max} USD/year</p>
                  <button
                    onClick={() => setSelectedUniversity(university)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="pagination-controls">
              <button onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>Page {currentPage} of {Math.ceil(filteredUniversities.length / universitiesPerPage)}</span>
              <button
                onClick={nextPage}
                disabled={currentPage === Math.ceil(filteredUniversities.length / universitiesPerPage)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default UserDashboard