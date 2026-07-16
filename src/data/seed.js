import sequelize from '../config/database.js'
import Student from '../models/student.js'
import Habit from '../models/habit.js'

// Cuentas demo: aparecen en el panel del admin y permiten probar el login
// sin tener que registrar un estudiante nuevo primero.
const DEFAULT_STUDENTS = [
  { email: 'maria.garcia@universidad.edu', password: '123456', nombre: 'Maria Garcia Lopez', photo: '', isAdmin: false, notes: {} },
  { email: 'carlos.mendoza@universidad.edu', password: '123456', nombre: 'Carlos Mendoza Rios', photo: '', isAdmin: false, notes: {} },
  { email: 'estudiante@universidad.edu', password: '123456', nombre: 'Estudiante Demo', photo: '', isAdmin: false, notes: {} },
]

const DEFAULT_ADMIN = {
  email: 'admin@habitos.edu',
  password: 'admin123',
  nombre: 'Administrador',
  photo: '',
  isAdmin: true,
  notes: {},
}

const DEFAULT_HABITS = [
  { icon: '📚', nombre: 'Lectura diaria', meta: '30 min / día', dias: [], motivo: '', actividades: [] },
  { icon: '🏃', nombre: 'Ejercicio', meta: '3 veces / sem', dias: [], motivo: '', actividades: [] },
  { icon: '💧', nombre: 'Tomar agua', meta: '2 litros / día', dias: [], motivo: '', actividades: [] },
]

async function migrate() {
  // Pasa --force para BORRAR y recrear las tablas (útil la primera vez o si
  // cambiaste un modelo). Sin --force, solo crea lo que falte y no borra
  // datos existentes.
  const force = process.argv.includes('--force')

  try {
    await sequelize.sync({ force })
    console.log(`Tablas sincronizadas${force ? ' (recreadas desde cero)' : ''}.`)

    for (const student of [...DEFAULT_STUDENTS, DEFAULT_ADMIN]) {
      await Student.findOrCreate({ where: { email: student.email }, defaults: student })
    }

    for (const student of DEFAULT_STUDENTS) {
      const count = await Habit.count({ where: { studentEmail: student.email } })
      if (count > 0) continue
      await Habit.bulkCreate(
        DEFAULT_HABITS.map(habit => ({ ...habit, studentEmail: student.email })),
      )
    }

    console.log(`Migración completada: ${DEFAULT_STUDENTS.length + 1} cuentas y hábitos por defecto insertados.`)
  } catch (error) {
    console.error('Error en la migración:', error)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

migrate()
