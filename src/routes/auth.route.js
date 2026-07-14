import { Router } from 'express'
import { adminLogin, studentLogin, studentRegister } from '../controllers/auth.controllers.js'

const authRouter = Router()

authRouter.post('/auth/student/register', studentRegister)
authRouter.post('/auth/student/login', studentLogin)
authRouter.post('/auth/admin/login', adminLogin)

export default authRouter
