import express from 'express'
import mysql from 'mysql2'
import {protect} from '../middleware/authMiddleware.js'

const router = express.Router()

const db = mysql.createConnection({
  host: '172.21.136.179',
  user: 'newuser',
  password: 'newpassword',
  database: 'edunet',
})

// Route to fetch university details
router.get('/details', protect, (req, res) => {
  const universityId = req.user.id
  const query = 'SELECT * FROM universities WHERE id = ?'

  db.query(query, [universityId], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'Database query failed'})
    }

    if (results.length === 0) {
      return res.status(404).json({message: 'University not found'})
    }

    res.json(results[0])
  })
})

router.get('/', (req, res) => {
  const query = `
      SELECT id,
             name,
             country,
             city,
             description,
             study_levels,
             study_fields,
             tuition_fee_min,
             tuition_fee_max,
             DATE_FORMAT(application_deadline, '%M %d, %Y') AS application_deadline,
             contact_email,
             contact_phone,
             website_url
      FROM my_universities;
  `

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({error: 'Database query failed'})
    }
    console.log('Fetched universities:', results)
    res.json(results)
  })
})

export default router
