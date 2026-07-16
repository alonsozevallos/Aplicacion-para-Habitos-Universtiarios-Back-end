import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

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
      type: DataTypes.JSONB,
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

export default Student
