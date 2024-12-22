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

// Add a new program
router.post('/programs', protect, (req, res) => {
  const {
    name,
    study_field,
    study_level,
    tuition_fee_min,
    tuition_fee_max,
    description,
    application_deadline,
  } = req.body

  const university_id = req.user.id

  const insertQuery = `
      INSERT INTO programs (university_id, name, study_field, study_level, tuition_fee_min, tuition_fee_max,
                            description, application_deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    insertQuery,
    [university_id, name, study_field, study_level, tuition_fee_min, tuition_fee_max, description, application_deadline],
    (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).json({error: 'Database insertion failed', details: err.message})
      }

      const fetchQuery = `SELECT *
                          FROM programs
                          WHERE id = ?`
      db.query(fetchQuery, [result.insertId], (fetchErr, fetchResult) => {
        if (fetchErr) {
          return res.status(500).json({error: 'Failed to fetch newly added program', details: fetchErr.message})
        }
        console.log('Program added and fetched:', fetchResult[0])
        res.status(201).json(fetchResult[0])
      })
    }
  )
})

// Fetch all programs for a university
router.get('/programs', protect, (req, res) => {
  const university_id = req.user.id

  const query = `
      SELECT *
      FROM programs
      WHERE university_id = ?
  `

  db.query(query, [university_id], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'Database query failed', details: err.message})
    }
    res.json(results)
  })
})

// Update a program
router.put('/programs/:id', protect, (req, res) => {
  const {id} = req.params

  console.log('IDDD: ', id)

  const {
    name,
    study_field,
    study_level,
    tuition_fee_min,
    tuition_fee_max,
    description,
    application_deadline,
  } = req.body

  const university_id = req.user.id

  const updateQuery = `
      UPDATE programs
      SET name                 = ?,
          study_field          = ?,
          study_level          = ?,
          tuition_fee_min      = ?,
          tuition_fee_max      = ?,
          description          = ?,
          application_deadline = ?
      WHERE id = ?
        AND university_id = ?
  `

  const values = [
    name,
    study_field,
    study_level,
    tuition_fee_min,
    tuition_fee_max,
    description,
    application_deadline,
    id,
    university_id,
  ]

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      return res.status(500).json({error: 'Database update failed', details: err.message})
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({message: 'Program not found or unauthorized'})
    }

    res.status(200).json({message: 'Program updated successfully'})
  })
})

// Delete a program
router.delete('/programs/:id', protect, (req, res) => {
  const {id} = req.params
  const university_id = req.user.id

  const query = `
      DELETE
      FROM programs
      WHERE id = ?
        AND university_id = ?
  `

  db.query(query, [id, university_id], (err, result) => {
    if (err) {
      return res.status(500).json({error: 'Database deletion failed', details: err.message})
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({message: 'Program not found or unauthorized'})
    }
    res.json({message: 'Program deleted successfully'})
  })
})

// Fetch programs for a specific university
router.get('/university/:id/programs', (req, res) => {
  const {id} = req.params

  const query = `
      SELECT *
      FROM programs
      WHERE university_id = ?
  `

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({error: 'Database query failed', details: err.message})
    }
    res.json(results)
  })
})

export default router
