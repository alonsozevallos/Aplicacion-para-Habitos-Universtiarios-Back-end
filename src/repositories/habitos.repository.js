import { Habit, Student } from '../models/sequelize.js'

const DEFAULT_HABITS = [
  { icon: '📚', nombre: 'Lectura diaria', meta: '30 min / día', dias: [], motivo: '', actividades: [] },
  { icon: '🏃', nombre: 'Ejercicio', meta: '3 veces / sem', dias: [], motivo: '', actividades: [] },
  { icon: '💧', nombre: 'Tomar agua', meta: '2 litros / día', dias: [], motivo: '', actividades: [] },
]

const toPlainHabit = (habit) => {
  const plain = habit.get({ plain: true })
  return {
    id: plain.id,
    icon: plain.icon,
    nombre: plain.nombre,
    meta: plain.meta,
    dias: Array.isArray(plain.dias) ? plain.dias : [],
    motivo: plain.motivo || '',
    actividades: Array.isArray(plain.actividades) ? plain.actividades : [],
  }
}

const ensureStudentRecord = async (studentEmail) => {
  const student = await Student.findByPk(studentEmail)
  if (student) return student

  return Student.create({
    email: studentEmail,
    nombre: 'Estudiante',
    password: '123456',
    photo: '',
    notes: {},
    isAdmin: false,
  })
}

const ensureDefaultHabits = async (studentEmail) => {
  const count = await Habit.count({ where: { studentEmail } })
  if (count > 0) return

  await Habit.bulkCreate(
    DEFAULT_HABITS.map(habit => ({
      ...habit,
      studentEmail,
    })),
  )
}

export const findAllByStudent = async (studentEmail) => {
  await ensureStudentRecord(studentEmail)
  await ensureDefaultHabits(studentEmail)

  const habits = await Habit.findAll({
    where: { studentEmail },
    order: [['id', 'ASC']],
  })

  return habits.map(toPlainHabit)
}

export const findById = async (studentEmail, habitId) => {
  const habit = await Habit.findOne({
    where: { id: habitId, studentEmail },
  })

  return habit ? toPlainHabit(habit) : null
}

export const createHabit = async (studentEmail, habitData) => {
  await ensureStudentRecord(studentEmail)
  const habit = await Habit.create({
    ...habitData,
    studentEmail,
  })

  return toPlainHabit(habit)
}

export const updateHabit = async (studentEmail, habitId, patch) => {
  const habit = await Habit.findOne({
    where: { id: habitId, studentEmail },
  })

  if (!habit) return null

  habit.set({ ...patch })
  await habit.save()

  return toPlainHabit(habit)
}

export const deleteHabit = async (studentEmail, habitId) => {
  const deleted = await Habit.destroy({
    where: { id: habitId, studentEmail },
  })

  return deleted > 0
}
