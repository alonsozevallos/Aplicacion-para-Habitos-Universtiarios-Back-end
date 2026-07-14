import { buildLoginPayload, buildStudentFromRegisterPayload } from '../models/students.model.js'
import { createStudent, verifyAdminCredentials, verifyStudentCredentials } from '../repositories/students.repository.js'

export const studentRegister = async (req, res, next) => {
  try {
    const studentData = buildStudentFromRegisterPayload(req.body)
    const created = await createStudent(studentData)

    if (!created) {
      res.status(409).json({ error: 'El correo ya se encuentra registrado.' })
      return
    }

    res
      .status(201)
      .location(`/api/students/${encodeURIComponent(created.email)}`)
      .json({ data: created })
  } catch (err) {
    next(err)
  }
}

export const studentLogin = async (req, res, next) => {
  try {
    const { email, password } = buildLoginPayload(req.body)
    const student = await verifyStudentCredentials(email, password)

    if (!student) {
      res.status(401).json({ error: 'Correo o contraseña inválidos.' })
      return
    }

    res.status(200).json({ data: student })
  } catch (err) {
    next(err)
  }
}

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = buildLoginPayload(req.body)
    const admin = await verifyAdminCredentials(email, password)

    if (!admin) {
      res.status(401).json({ error: 'Credenciales de administrador inválidas.' })
      return
    }

    res.status(200).json({ data: admin })
  } catch (err) {
    next(err)
  }
}
