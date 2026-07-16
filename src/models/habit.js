import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import Student from './student.js'

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
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    actividades: {
      type: DataTypes.JSONB,
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

export default Habit
