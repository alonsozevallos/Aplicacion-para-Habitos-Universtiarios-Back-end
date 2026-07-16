import app from './src/app.js'
import sequelize from './src/config/database.js'

const PORT = process.env.PORT || 3001

async function main() {
  try {
    await sequelize.authenticate()
    console.log('Conexión a la base de datos establecida correctamente.')

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('No se pudo conectar a la base de datos.')
    console.error('Detalle:', error?.message || error)
    console.error('Sugerencia: corre "npm run migrate" para crear las tablas.')
    process.exit(1)
  }
}


if (!process.env.VERCEL) {
  main()
}

// Exportar para Vercel
export default app
