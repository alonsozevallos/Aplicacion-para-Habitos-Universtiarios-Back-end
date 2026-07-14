import {
  buildNotePayload,
  buildPhotoPatchPayload,
  validateEmail,
  validateIsoDate,
} from '../models/students.model.js'
import {
  deleteStudentNote,
  findStudentByEmail,
  getStudentNotes,
  listStudents,
  updateStudentPhoto,
  upsertStudentNote,
} from '../repositories/students.repository.js'

export const getStudents = async (_req, res, next) => {
  try {
    const students = await listStudents()
    res.status(200).json({ data: students })
  } catch (err) {
    next(err)
  }
}

export const getStudentByEmail = async (req, res, next) => {
  try {
    const email = validateEmail(req.params.studentEmail)
    const student = await findStudentByEmail(email)

    if (!student) {
      res.status(404).json({ error: 'Estudiante no encontrado.' })
      return
    }

    res.status(200).json({
      data: {
        email: student.email,
        nombre: student.nombre,
        photo: student.photo || '',
      },
    })
  } catch (err) {
    next(err)
  }
}

export const patchStudentPhoto = async (req, res, next) => {
  try {
    const email = validateEmail(req.params.studentEmail)
    const { photo } = buildPhotoPatchPayload(req.body)
    const updated = await updateStudentPhoto(email, photo)

    if (!updated) {
      res.status(404).json({ error: 'Estudiante no encontrado.' })
      return
    }

    res.status(200).json({ data: updated })
  } catch (err) {
    next(err)
  }
}

export const getCalendarNotesByStudent = async (req, res, next) => {
  try {
    const email = validateEmail(req.params.studentEmail)
    const notes = await getStudentNotes(email)

    if (!notes) {
      res.status(404).json({ error: 'Estudiante no encontrado.' })
      return
    }

    res.status(200).json({ data: notes })
  } catch (err) {
    next(err)
  }
}

export const upsertCalendarNoteByStudent = async (req, res, next) => {
  try {
    const email = validateEmail(req.params.studentEmail)
    const isoDate = validateIsoDate(req.params.isoDate)
    const { text } = buildNotePayload(req.body)

    const updated = await upsertStudentNote(email, isoDate, text)
    if (!updated) {
      res.status(404).json({ error: 'Estudiante no encontrado.' })
      return
    }

    res.status(200).json({ data: updated })
  } catch (err) {
    next(err)
  }
}

export const deleteCalendarNoteByStudent = async (req, res, next) => {
  try {
    const email = validateEmail(req.params.studentEmail)
    const isoDate = validateIsoDate(req.params.isoDate)

    const result = await deleteStudentNote(email, isoDate)
    if (result === null) {
      res.status(404).json({ error: 'Estudiante no encontrado.' })
      return
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
