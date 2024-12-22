import express from 'express'
import {login, signup} from '../controllers/authController.js'
import {authorizeRoles, protect} from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

export default router

router.get('/protected', protect, (req, res) => {
  res.json({message: 'This is a protected route', user: req.user})
})

router.get(
  '/university/dashboard',
  protect,
  authorizeRoles(['university']),
  (req, res) => {
    res.json({message: 'Welcome to the University Dashboard!'})
  }
)

router.get(
  '/user/dashboard',
  protect,
  authorizeRoles(['user']),
  (req, res) => {
    res.json({message: 'Welcome to the User Dashboard!'})
  }
)