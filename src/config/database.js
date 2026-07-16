import { Sequelize } from 'sequelize'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.DATABASE_URL

const sequelize = url
  ? new Sequelize(url, {
      dialect: 'postgres',
      dialectModule: pg,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      logging: false,
      pool: { max: 2 },
    })
  : new Sequelize(
      process.env.DB_NAME || 'habitos_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        dialectModule: pg,
        logging: false,
      },
    )

export default sequelize
