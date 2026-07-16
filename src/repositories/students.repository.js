import Student from '../models/student.js'

const toPublicStudent = (student) => ({
  email: student.email,
  nombre: student.nombre,
  photo: student.photo || '',
})

export const listStudents = async () => {
  const students = await Student.findAll({
    where: { isAdmin: false },
    order: [['email', 'ASC']],
  })
  return students.map(student => toPublicStudent(student.get({ plain: true })))
}

export const findStudentByEmail = async (email) => {
  const student = await Student.findByPk(email)
  return student ? student.get({ plain: true }) : null
}

export const createStudent = async ({ nombre, email, password, photo = '' }) => {
  const exists = await Student.findByPk(email)
  if (exists) return null

  const created = await Student.create({
    nombre,
    email,
    password,
    photo,
    notes: {},
    isAdmin: false,
  })

  return toPublicStudent(created.get({ plain: true }))
}

export const verifyStudentCredentials = async (email, password) => {
  const student = await Student.findOne({
    where: { email, password, isAdmin: false },
  })

  if (!student) return null
  return toPublicStudent(student.get({ plain: true }))
}

export const verifyAdminCredentials = async (email, password) => {
  const admin = await Student.findOne({
    where: { email, password, isAdmin: true },
  })

  if (!admin) return null
  const plain = admin.get({ plain: true })
  return { email: plain.email, nombre: plain.nombre }
}

export const updateStudentPhoto = async (email, photo) => {
  const student = await Student.findByPk(email)
  if (!student) return null

  student.photo = photo
  await student.save()
  return toPublicStudent(student.get({ plain: true }))
}

export const getStudentNotes = async (email) => {
  const student = await Student.findByPk(email)
  if (!student) return null
  const plain = student.get({ plain: true })
  return { ...(plain.notes || {}) }
}

export const upsertStudentNote = async (email, isoDate, text) => {
  const student = await Student.findByPk(email)
  if (!student) return null

  const notes = { ...(student.notes || {}) }
  notes[isoDate] = text
  student.notes = notes
  await student.save()

  return { date: isoDate, text: notes[isoDate] }
}

export const deleteStudentNote = async (email, isoDate) => {
  const student = await Student.findByPk(email)
  if (!student) return null

  const notes = { ...(student.notes || {}) }
  const existed = Object.prototype.hasOwnProperty.call(notes, isoDate)
  if (existed) {
    delete notes[isoDate]
    student.notes = notes
    await student.save()
  }

  return existed
}
