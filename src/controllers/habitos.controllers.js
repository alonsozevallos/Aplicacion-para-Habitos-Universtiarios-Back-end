import {
	buildHabitFromPayload,
	buildHabitPatchFromPayload,
	validateStudentEmail,
} from '../models/habitos.model.js'
import {
	createHabit,
	deleteHabit,
	findAllByStudent,
	findById,
	updateHabit,
} from '../repositories/habitos.repository.js'

const parseHabitId = (value) => {
	const habitId = Number(value)
	if (!Number.isInteger(habitId) || habitId <= 0) {
		const err = new Error('El ID del hábito debe ser un entero positivo.')
		err.status = 400
		throw err
	}
	return habitId
}

export const getHabitsByStudent = async (req, res, next) => {
	try {
		const studentEmail = validateStudentEmail(req.params.studentEmail)
		const habits = await findAllByStudent(studentEmail)
		res.status(200).json({ data: habits })
	} catch (err) {
		next(err)
	}
}

export const getHabitById = async (req, res, next) => {
	try {
		const studentEmail = validateStudentEmail(req.params.studentEmail)
		const habitId = parseHabitId(req.params.habitId)
		const habit = await findById(studentEmail, habitId)

		if (!habit) {
			res.status(404).json({ error: 'Hábito no encontrado.' })
			return
		}

		res.status(200).json({ data: habit })
	} catch (err) {
		next(err)
	}
}

export const createHabitByStudent = async (req, res, next) => {
	try {
		const studentEmail = validateStudentEmail(req.params.studentEmail)
		const habitData = buildHabitFromPayload(req.body)
		const created = await createHabit(studentEmail, habitData)
		res
			.status(201)
			.location(`/api/students/${encodeURIComponent(studentEmail)}/habitos/${created.id}`)
			.json({ data: created })
	} catch (err) {
		next(err)
	}
}

export const updateHabitByStudent = async (req, res, next) => {
	try {
		const studentEmail = validateStudentEmail(req.params.studentEmail)
		const habitId = parseHabitId(req.params.habitId)
		const patch = buildHabitPatchFromPayload(req.body)
		const updated = await updateHabit(studentEmail, habitId, patch)

		if (!updated) {
			res.status(404).json({ error: 'Hábito no encontrado.' })
			return
		}

		res.status(200).json({ data: updated })
	} catch (err) {
		next(err)
	}
}

export const deleteHabitByStudent = async (req, res, next) => {
	try {
		const studentEmail = validateStudentEmail(req.params.studentEmail)
		const habitId = parseHabitId(req.params.habitId)
		const deleted = await deleteHabit(studentEmail, habitId)

		if (!deleted) {
			res.status(404).json({ error: 'Hábito no encontrado.' })
			return
		}

		res.status(204).send()
	} catch (err) {
		next(err)
	}
}
