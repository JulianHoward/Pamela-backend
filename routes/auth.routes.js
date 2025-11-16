import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

// Login
router.post("/login", (req, res) => {
  const username = req.body.username ?? "";
  const password = req.body.password ?? "";

  if (!username || !password) {
    return res.status(400).json({ ok: false, message: "Usuario y contraseña son requeridos" });
  }

  const ADMIN_USER = process.env.ADMIN_USER || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, message: "Credenciales inválidas" });
  }

  // ✅ Guarda usuario en sesión
  req.session.user = { username: ADMIN_USER };

  // Forzar que la cookie se envíe al cliente
  req.session.save((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al iniciar sesión" });
    }
    return res.status(200).json({
      ok: true,
      message: "Autenticado correctamente",
      user: req.session.user,
    });
  });
});

// Verificar sesión
router.get("/me", (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ user: req.session.user });
  }
  return res.status(401).json({ message: "No autenticado" });
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Error al cerrar sesión" });
    res.clearCookie("connect.sid"); // limpiar cookie del cliente
    return res.status(200).json({ message: "Sesión cerrada" });
  });
});

export default router;
