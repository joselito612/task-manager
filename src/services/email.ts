import nodemailer from 'nodemailer'

// Configuración del transporter (solo conexión SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Función específica para enviar email de recuperación
export const sendResetEmail = async (to: string, resetLink: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Task Manager" <noreply@taskmanager.com>',
    to,
    subject: 'Recuperación de contraseña',
    html: `
      <h1>Recupera tu contraseña</h1>
      <p>Haz clic en el siguiente enlace:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Expira en 1 hora.</p>
    `,
  })
}