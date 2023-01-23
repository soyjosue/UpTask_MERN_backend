import nodemailer from "nodemailer";



const getTransport = () => nodemailer.createTransport({
  host: `${process.env.EMAIL_HOST}`,
  port: `${process.env.EMAIL_PORT}`,
  auth: {
    user: `${process.env.EMAIL_USER}`,
    pass: `${process.env.EMAIL_PASS}`
  }
});

const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  // Información EMAIL
  const info = await getTransport().sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Comprueba tu cuenta.',
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola ${nombre} Comprueba tu cuenta en UpTask</p>
    <p>
      Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
    </p>

    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>

    `
  });
};

const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  // Información EMAIL
  const info = await getTransport().sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Restablece tu contraseña.',
    text: "Restablece tu contraseña",
    html: `<p>Hola ${nombre} has solicitado restablecer tu contraseña</p>
    <p>
      Sigue el siguiente enlace para generar una nueva contraseña:
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Contraseña</a>
    </p>

    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    `
  });
};

export {
  emailRegistro,
  emailOlvidePassword
};
