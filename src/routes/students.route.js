import { Router } from 'express'
import {
	deleteCalendarNoteByStudent,
	getCalendarNotesByStudent,
	getStudentByEmail,
	getStudents,
	patchStudentPhoto,
	upsertCalendarNoteByStudent,
} from '../controllers/students.controllers.js'

const studentsRouter = Router()

studentsRouter.get('/students', getStudents)
studentsRouter.get('/students/:studentEmail', getStudentByEmail)
studentsRouter.patch('/students/:studentEmail/photo', patchStudentPhoto)
studentsRouter.get('/students/:studentEmail/notes', getCalendarNotesByStudent)
studentsRouter.put('/students/:studentEmail/notes/:isoDate', upsertCalendarNoteByStudent)
studentsRouter.delete('/students/:studentEmail/notes/:isoDate', deleteCalendarNoteByStudent)

export default studentsRouter
