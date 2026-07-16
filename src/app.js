import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import habitosRouter from './routes/habitos.route.js'
import authRouter from './routes/auth.route.js'
import studentsRouter from './routes/students.route.js'
import sequelize from './config/database.js'

dotenv.config()

const app = express()

// Igual idea que el ensureDatabaseConnection() del ejemplo del profe:
// en Vercel (serverless) no hay un "arranque" fijo como app.listen(), así
// que se valida la conexión antes de atender peticiones, cacheando el
// resultado para no repetirlo en cada invocación del mismo contenedor.
// Se registra aquí (antes de las rutas) para que sí se ejecute: nuestro
// app.js, a diferencia del ejemplo, tiene un handler 404 al final que
// respondería primero si este middleware se agregara después (como en
// index.js del profe).
if (process.env.VERCEL) {
	let dbConnected = false
	app.use(async (_req, res, next) => {
		if (!dbConnected) {
			try {
				await sequelize.authenticate()
				console.log('Conexion a la base de datos establecida correctamente')
				dbConnected = true
			} catch (error) {
				console.error('Error conectando a la base de datos:', error)
				return res.status(500).json({ error: 'No se pudo conectar a la base de datos.' })
			}
		}
		next()
	})
}

const allowedOrigins = (process.env.CORS_ORIGINS || '')
	.split(',')
	.map(origin => origin.trim())
	.filter(Boolean)

const corsOptions = {
	origin: (origin, callback) => {
		// Permite requests sin origin (Postman, curl, health checks)
		if (!origin) {
			callback(null, true)
			return
		}

		if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
			callback(null, true)
			return
		}

		callback(new Error('Origen no permitido por CORS'))
	},
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req, res) => {
	res.status(200).json({
		message: 'API de Habitos en linea',
		health: '/health',
		apiBase: '/api',
		habitsExample: '/api/students/estudiante@universidad.edu/habitos',
	})
})

app.get('/health', (_req, res) => {
	res.status(200).json({
		ok: true,
		service: 'habitos-api',
		timestamp: new Date().toISOString(),
	})
})

app.get('/api', (_req, res) => {
	res.status(200).json({
		message: 'API de Habitos disponible',
		version: 'v1',
		resources: {
			authStudentLogin: '/api/auth/student/login',
			authStudentRegister: '/api/auth/student/register',
			authAdminLogin: '/api/auth/admin/login',
			students: '/api/students',
			studentByEmail: '/api/students/:studentEmail',
			studentPhotoPatch: '/api/students/:studentEmail/photo',
			studentNotes: '/api/students/:studentEmail/notes',
			studentNoteByDate: '/api/students/:studentEmail/notes/:isoDate',
			habitos: '/api/students/:studentEmail/habitos',
			habitoById: '/api/students/:studentEmail/habitos/:habitId',
		},
	})
})

app.use('/api', authRouter)
app.use('/api', studentsRouter)
app.use('/api', habitosRouter)

app.use((req, res) => {
	res.status(404).json({
		error: 'Ruta no encontrada',
		path: req.originalUrl,
		method: req.method,
	})
})

app.use((err, _req, res, _next) => {
	const status = err.status || 500
	const isDev = process.env.NODE_ENV !== 'production'

	res.status(status).json({
		error: 'Error interno del servidor',
		message: err.message,
		...(isDev ? { stack: err.stack } : {}),
	})
})

export default app
