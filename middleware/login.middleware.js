// middleware/login.middleware.js

import dotenv from 'dotenv';

dotenv.config();

export const loginMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No autorizado" });
  }

  // Authorization: Basic base64(user:pass)
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [user, password] = credentials.split(":");

  // Verificación de usuario y contraseña
  if (user === process.env.DB_USER && password === process.env.DB_PASSWORD) {
    return next(); // Si las credenciales son correctas, pasa al siguiente middleware o ruta
  }

  // Si las credenciales son incorrectas
  return res.status(403).json({ message: "Credenciales inválidas" });
};
