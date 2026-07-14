const DAY_KEYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const normalizeString = (value) => {
	if (typeof value !== 'string') return ''
	return value.trim()
}

const normalizeDias = (dias) => {
	if (!Array.isArray(dias)) return []
	const unique = [...new Set(dias.map(day => String(day).trim().toUpperCase()))]
	return unique.filter(day => DAY_KEYS.includes(day))
}

export const validateStudentEmail = (studentEmail) => {
	if (!isNonEmptyString(studentEmail)) {
		const err = new Error('El correo del estudiante es obligatorio.')
		err.status = 400
		throw err
	}

	return studentEmail.trim().toLowerCase()
}

export const buildHabitFromPayload = (payload = {}) => {
	const nombre = normalizeString(payload.nombre)
	const meta = normalizeString(payload.meta)
	const icon = normalizeString(payload.icon) || '✨'
	const motivo = normalizeString(payload.motivo)
	const dias = normalizeDias(payload.dias)

	if (!nombre) {
		const err = new Error('El nombre del hábito es obligatorio.')
		err.status = 400
		throw err
	}

	if (!meta) {
		const err = new Error('La meta del hábito es obligatoria.')
		err.status = 400
		throw err
	}

	return {
		nombre,
		meta,
		icon,
		motivo,
		dias,
		actividades: Array.isArray(payload.actividades) ? payload.actividades : [],
	}
}

export const buildHabitPatchFromPayload = (payload = {}) => {
	const patch = {}

	if (Object.prototype.hasOwnProperty.call(payload, 'nombre')) {
		const nombre = normalizeString(payload.nombre)
		if (!nombre) {
			const err = new Error('El nombre del hábito no puede estar vacío.')
			err.status = 400
			throw err
		}
		patch.nombre = nombre
	}

	if (Object.prototype.hasOwnProperty.call(payload, 'meta')) {
		const meta = normalizeString(payload.meta)
		if (!meta) {
			const err = new Error('La meta del hábito no puede estar vacía.')
			err.status = 400
			throw err
		}
		patch.meta = meta
	}

	if (Object.prototype.hasOwnProperty.call(payload, 'icon')) {
		patch.icon = normalizeString(payload.icon) || '✨'
	}

	if (Object.prototype.hasOwnProperty.call(payload, 'motivo')) {
		patch.motivo = normalizeString(payload.motivo)
	}

	if (Object.prototype.hasOwnProperty.call(payload, 'dias')) {
		patch.dias = normalizeDias(payload.dias)
	}

	if (Object.prototype.hasOwnProperty.call(payload, 'actividades')) {
		if (!Array.isArray(payload.actividades)) {
			const err = new Error('El campo actividades debe ser un arreglo.')
			err.status = 400
			throw err
		}
		patch.actividades = payload.actividades
	}

	if (Object.keys(patch).length === 0) {
		const err = new Error('No se enviaron campos válidos para actualizar.')
		err.status = 400
		throw err
	}

	return patch
}
