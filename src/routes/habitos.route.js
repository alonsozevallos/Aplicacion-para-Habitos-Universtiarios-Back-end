import { Router } from 'express'
import {
	createHabitByStudent,
	deleteHabitByStudent,
	getHabitById,
	getHabitsByStudent,
	updateHabitByStudent,
} from '../controllers/habitos.controllers.js'

const habitosRouter = Router()

habitosRouter.get('/students/:studentEmail/habitos', getHabitsByStudent)
habitosRouter.get('/students/:studentEmail/habitos/:habitId', getHabitById)
habitosRouter.post('/students/:studentEmail/habitos', createHabitByStudent)
habitosRouter.put('/students/:studentEmail/habitos/:habitId', updateHabitByStudent)
habitosRouter.patch('/students/:studentEmail/habitos/:habitId', updateHabitByStudent)
habitosRouter.delete('/students/:studentEmail/habitos/:habitId', deleteHabitByStudent)

export default habitosRouter
