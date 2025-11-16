// routes/noticia.routes.js
import { Router } from "express";
import {
  listNoticias,
  getNoticia,
  createNoticia,
  updateNoticia,
  deleteNoticia,
  getImagen,
  uploadImagen,
} from "../controllers/noticia.controller.js";
import { checkAuthMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// GET públicas
router.get("/", listNoticias);
router.get("/:id", getNoticia);
router.get("/:id/imagen", getImagen);

// Rutas protegidas: requieren sesión
router.post("/", checkAuthMiddleware, createNoticia);
router.put("/:id", checkAuthMiddleware, updateNoticia);
router.delete("/:id", checkAuthMiddleware, deleteNoticia);
router.post("/:id/imagen", checkAuthMiddleware, uploadImagen);

export default router;
