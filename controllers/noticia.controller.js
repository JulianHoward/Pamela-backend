// controllers/noticia.controller.js
import db from "../models/index.js";
import { upload } from "../index.js";
import { checkRequiredFields, sendError500 } from "../utils/request.utils.js";

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

// ---------------------------
// LISTAR TODAS LAS NOTICIAS
// ---------------------------
export const listNoticias = async (req, res) => {
  try {
    const noticias = await db.noticias.findAll();

    const data = noticias.map((n) => ({
      ...n.toJSON(),
      imagen: n.imagen_url
        ? n.imagen_url.startsWith("http")
          ? n.imagen_url
          : `${BASE_URL}${n.imagen_url}`
        : null,
    }));

    res.json(data);
  } catch (error) {
    sendError500(res, error);
  }
};

// ---------------------------
// OBTENER NOTICIA POR ID
// ---------------------------
export const getNoticia = async (req, res) => {
  try {
    const noticia = await db.noticias.findByPk(req.params.id);
    if (!noticia) return res.status(404).json({ message: "Noticia no encontrada." });

    const data = {
      ...noticia.toJSON(),
      imagen: noticia.imagen_url
        ? noticia.imagen_url.startsWith("http")
          ? noticia.imagen_url
          : `${BASE_URL}${noticia.imagen_url}`
        : null,
    };

    res.json(data);
  } catch (error) {
    sendError500(res, error);
  }
};

// ---------------------------
// CREAR NOTICIA
// ---------------------------
export const createNoticia = async (req, res) => {
  const ct = req.headers["content-type"] || "";

  if (!ct.includes("application/json") || !req.body) return res.status(204).end();

  const requiredFields = ["titulo", "contenido"];
  const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

  if (fieldsWithErrors.length > 0) {
    return res.status(400).json({
      message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
    });
  }

  try {
    const noticiaNueva = await db.noticias.create(req.body);

    const data = {
      ...noticiaNueva.toJSON(),
      imagen: noticiaNueva.imagen_url
        ? noticiaNueva.imagen_url.startsWith("http")
          ? noticiaNueva.imagen_url
          : `${BASE_URL}${noticiaNueva.imagen_url}`
        : null,
    };

    res.json(data);
  } catch (error) {
    sendError500(res, error);
  }
};

// ---------------------------
// ACTUALIZAR NOTICIA
// ---------------------------
export const updateNoticia = async (req, res) => {
  const id = req.params.id;
  try {
    const noticia = await db.noticias.findByPk(id);
    if (!noticia) return res.status(404).json({ message: "Noticia no encontrada." });

    const requiredFields = ["titulo", "contenido"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
      return res.status(400).json({
        message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
      });
    }

    await noticia.update(req.body);

    const data = {
      ...noticia.toJSON(),
      imagen: noticia.imagen_url
        ? noticia.imagen_url.startsWith("http")
          ? noticia.imagen_url
          : `${BASE_URL}${noticia.imagen_url}`
        : null,
    };

    res.json(data);
  } catch (error) {
    sendError500(res, error);
  }
};

// ---------------------------
// ELIMINAR NOTICIA
// ---------------------------
export const deleteNoticia = async (req, res) => {
  const id = req.params.id;
  try {
    const noticia = await db.noticias.findByPk(id);
    if (!noticia) return res.status(404).json({ message: "Noticia no encontrada." });

    await noticia.destroy();
    res.json({ message: "Noticia eliminada correctamente." });
  } catch (error) {
    sendError500(res, error);
  }
};

// ---------------------------
// OBTENER URL DE IMAGEN
// ---------------------------
export const getImagen = async (req, res) => {
  try {
    const noticia = await db.noticias.findByPk(req.params.id);
    if (!noticia) return res.status(404).json({ message: "Noticia no encontrada." });
    if (!noticia.imagen_url) return res.status(404).json({ message: "Imagen no encontrada." });

    res.redirect(noticia.imagen_url);
  } catch (error) {
    sendError500(res, error);
  }
};

// ---------------------------
// SUBIR IMAGEN DE NOTICIA
// ---------------------------
export const uploadImagen = async (req, res) => {
  const id = req.params.id;
  try {
    const noticia = await db.noticias.findByPk(id);
    if (!noticia) return res.status(404).json({ message: "Noticia no encontrada." });

    upload.single("imagen")(req, res, async function (err) {
      if (err) {
        return res.status(500).json({
          message: "Error al subir la imagen",
          error: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No se subió ningún archivo" });
      }

      const imgUrl = `${BASE_URL}/images/noticias/${req.file.filename}`;
      await noticia.update({ imagen_url: imgUrl });

      const noticiaActualizada = await db.noticias.findByPk(id);

      const data = {
        ...noticiaActualizada.toJSON(),
        imagen: noticiaActualizada.imagen_url
          ? noticiaActualizada.imagen_url.startsWith("http")
            ? noticiaActualizada.imagen_url
            : `${BASE_URL}${noticiaActualizada.imagen_url}`
          : null,
      };

      res.json(data);
    });
  } catch (error) {
    sendError500(res, error);
  }
};
