const normalizeString = (value) => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const normalizeEmail = (value) => normalizeString(value).toLowerCase()
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export const validateEmail = (email) => {
  const normalized = normalizeEmail(email)
  if (!normalized || !normalized.includes('@')) {
    const err = new Error('Correo electrónico inválido.')
    err.status = 400
    throw err
  }
  return normalized
}

export const validatePassword = (password) => {
  const value = normalizeString(password)
  if (value.length < 6) {
    const err = new Error('La contraseña debe tener al menos 6 caracteres.')
    err.status = 400
    throw err
  }
  return value
}

export const buildStudentFromRegisterPayload = (payload = {}) => {
  const nombre = normalizeString(payload.nombre)
  const email = validateEmail(payload.email)
  const password = validatePassword(payload.password)
  const photo = normalizeString(payload.photo)

  if (!nombre) {
    const err = new Error('El nombre es obligatorio.')
    err.status = 400
    throw err
  }

  return { nombre, email, password, photo }
}

export const buildLoginPayload = (payload = {}) => {
  const email = validateEmail(payload.email)
  const password = validatePassword(payload.password)
  return { email, password }
}

export const buildPhotoPatchPayload = (payload = {}) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'photo')) {
    const err = new Error('Debes enviar el campo photo.')
    err.status = 400
    throw err
  }

  const photo = typeof payload.photo === 'string' ? payload.photo.trim() : ''
  return { photo }
}

export const validateIsoDate = (isoDate) => {
  const value = normalizeString(isoDate)
  if (!ISO_DATE_REGEX.test(value)) {
    const err = new Error('La fecha debe tener formato YYYY-MM-DD.')
    err.status = 400
    throw err
  }
  return value
}

export const buildNotePayload = (payload = {}) => {
  if (!Object.prototype.hasOwnProperty.call(payload, 'text')) {
    const err = new Error('Debes enviar el campo text.')
    err.status = 400
    throw err
  }

  if (typeof payload.text !== 'string') {
    const err = new Error('El campo text debe ser string.')
    err.status = 400
    throw err
  }

  return { text: payload.text.trim() }
}
