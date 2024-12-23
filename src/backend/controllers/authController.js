import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createConnection({
  host: '172.21.136.179',
  user: 'newuser',
  password: 'newpassword',
  database: 'edunet',
})

db.connect((err) => {
  if (err) throw err
  console.log('MySQL Connected...')
})

export const signup = async (req, res) => {
  console.log('Received req.body:', req.body)

  const {role, ...data} = req.body
  console.log('Extracted data:', data)

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
  if (!passwordRegex.test(data.password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters long, contain an uppercase letter, and a number.',
    })
  }
  if (!role || !data.email || !data.password) {
    console.log('Missing fields:', data)
    return res.status(400).json({message: 'All fields are required'})
  }

  let checkQuery = ''
  if (role === 'user') {
    checkQuery = 'SELECT id FROM users WHERE email = ?'
  } else if (role === 'university') {
    checkQuery = 'SELECT id FROM my_universities WHERE contact_email = ?'
  } else {
    return res.status(400).json({message: 'Invalid role specified'})
  }

  db.query(checkQuery, [data.contact_email], async (err, results) => {
    if (err) {
      console.error('Database query error:', err)
      return res.status(500).json({message: 'Database query error', error: err})
    }

    if (results.length > 0) {
      return res.status(400).json({message: 'Email already exists'})
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    if (role === 'user') {
      const query = `
          INSERT INTO users (name, surename, email, password, sex, birth_date)
          VALUES (?, ?, ?, ?, ?, ?)
      `
      const values = [
        data.name,
        data.surname,
        data.email,
        hashedPassword,
        data.sex,
        data.birth_date,
      ]

      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Insert error (user):', err)
          return res.status(500).json({message: 'Error registering user', error: err})
        }

        console.log('Successfully inserted user:', data.name)

        return res.status(201).json({
          message: 'Signup successful',
          userId: result.insertId,
          name: data.name,
        })
      })
    }
    if (role === 'university') {
      const requiredFields = [
        'name',
        'country',
        'city',
        'description',
        'study_levels',
        'study_fields',
        'tuition_fee_min',
        'tuition_fee_max',
        'application_deadline',
        'contact_email',
        'contact_phone',
        'website_url',
        'password',
      ]

      for (const field of requiredFields) {
        if (!data[field]) {
          console.log(`Missing field: ${field}`)
          return res.status(400).json({message: `Field ${field} is required`})
        }
      }

      const query = `
          INSERT INTO my_universities (name, country, city, description, study_levels,
                                       study_fields, tuition_fee_min, tuition_fee_max,
                                       application_deadline, contact_email, contact_phone,
                                       website_url, password)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      const values = [
        data.name,
        data.country,
        data.city,
        data.description || 'No description available',
        data.study_levels || 'N/A',
        data.study_fields || 'N/A',
        data.tuition_fee_min || 0,
        data.tuition_fee_max || 0,
        data.application_deadline || null,
        data.contact_email,
        data.contact_phone || null,
        data.website_url || null,
        hashedPassword,
      ]

      console.log('Insert values:', values)

      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Insert error:', err)
          return res.status(500).json({message: 'Error registering university', error: err})
        }

        console.log('Successfully inserted university:', data.name)

        return res.status(201).json({
          message: 'Signup successful',
          universityId: result.insertId,
          name: data.name,
        })
      })
    }
  })
}

export const login = (req, res) => {
  const {email, password, role} = req.body

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({message: 'Email, password, and role are required'})
  }

  let query = ''

  if (role === 'user') {
    query = 'SELECT * FROM users WHERE email = ?'
  } else if (role === 'university') {
    query = 'SELECT * FROM my_universities WHERE contact_email = ?'
  } else {
    return res.status(400).json({message: 'Invalid role specified'})
  }

  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({message: 'Invalid email or password'})
    }

    const user = results[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({message: 'Invalid email or password'})
    }

    const token = jwt.sign({id: user.id, role}, process.env.JWT_SECRET || '12345678', {
      expiresIn: '1h',
    })

    const response = {
      message: 'Login successful',
      token,
    }

    if (role === 'university') {
      response.id = user.id
      response.name = user.name
    }

    return res.status(200).json(response)
  })
}
