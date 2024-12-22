import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] // Extract token after 'Bearer'

  if (!token) {
    return res.status(401).json({message: 'Unauthorized: No token provided'})
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || '12345678')
    next()
  } catch (error) {
    console.error('Token verification failed:', error)
    return res.status(401).json({message: 'Unauthorized: Invalid token'})
  }
}

export const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({message: 'Forbidden: Access denied'})
    }
    next()
  }
}
