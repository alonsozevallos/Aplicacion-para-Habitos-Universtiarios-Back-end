import { DataTypes, Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const DEFAULT_DB_PORT = 5432
const DB_DIALECT = process.env.DB_DIALECT || 'postgres'
const JSON_TYPE = DB_DIALECT === 'sqlite' ? DataTypes.JSON : DataTypes.JSONB

const sequelize = DB_DIALECT === 'sqlite'
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || './habitos.sqlite',
      logging: false,
    })
  : process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.DB_SSL === 'true'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    })
  : new Sequelize(
      process.env.DB_NAME || 'habitos_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || DEFAULT_DB_PORT,
        dialect: 'postgres',
        logging: false,
      },
    )

export const Student = sequelize.define(
  'Student',
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    notes: {
      type: JSON_TYPE,
      allowNull: false,
      defaultValue: {},
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'students',
  },
)

export const Habit = sequelize.define(
  'Habit',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Student,
        key: 'email',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '✨',
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dias: {
      type: JSON_TYPE,
      allowNull: false,
      defaultValue: [],
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    actividades: {
      type: JSON_TYPE,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: 'habits',
  },
)

Student.hasMany(Habit, {
  foreignKey: 'studentEmail',
  sourceKey: 'email',
  as: 'habits',
})

Habit.belongsTo(Student, {
  foreignKey: 'studentEmail',
  targetKey: 'email',
  as: 'student',
})

const DEFAULT_STUDENTS = [
  { email: 'maria.garcia@universidad.edu', password: '123456', nombre: 'Maria Garcia Lopez', photo: '', isAdmin: false },
  { email: 'carlos.mendoza@universidad.edu', password: '123456', nombre: 'Carlos Mendoza Rios', photo: '', isAdmin: false },
  { email: 'estudiante@universidad.edu', password: '123456', nombre: 'Estudiante Demo', photo: '', isAdmin: false },
]

const DEFAULT_ADMIN = {
  email: 'admin@habitos.edu',
  password: 'admin123',
  nombre: 'Administrador',
  photo: '',
  isAdmin: true,
}

const DEFAULT_HABITS = [
  { icon: '📚', nombre: 'Lectura diaria', meta: '30 min / día', dias: [], motivo: '', actividades: [] },
  { icon: '🏃', nombre: 'Ejercicio', meta: '3 veces / sem', dias: [], motivo: '', actividades: [] },
  { icon: '💧', nombre: 'Tomar agua', meta: '2 litros / día', dias: [], motivo: '', actividades: [] },
]

const seedStudents = async () => {
  for (const student of [...DEFAULT_STUDENTS, DEFAULT_ADMIN]) {
    await Student.findOrCreate({
      where: { email: student.email },
      defaults: {
        ...student,
        notes: {},
      },
    })
  }
}

const seedHabits = async () => {
  for (const student of DEFAULT_STUDENTS) {
    const count = await Habit.count({ where: { studentEmail: student.email } })
    if (count > 0) continue

    await Habit.bulkCreate(
      DEFAULT_HABITS.map(habit => ({
        ...habit,
        studentEmail: student.email,
      })),
    )
  }
}

export const initDatabase = async () => {
  await sequelize.authenticate()
  await sequelize.sync()
  await seedStudents()
  await seedHabits()
}

export default sequelize
