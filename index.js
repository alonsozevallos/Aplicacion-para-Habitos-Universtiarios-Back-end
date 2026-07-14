import dotenv from 'dotenv'
import app from './src/app.js'
import { initDatabase } from './src/models/sequelize.js'

dotenv.config()

const PORT = Number(process.env.PORT) || 3001

const bootstrap = async () => {
  try {
    await initDatabase()
    app.listen(PORT, () => {
      console.log(`API escuchando en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('No se pudo inicializar la base de datos PostgreSQL.')
    console.error('Detalle:', error?.message || error)
    if (error?.original?.message) {
      console.error('Origen:', error.original.message)
    }
    process.exit(1)
  }
}

bootstrap()
