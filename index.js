// app.js
import express from "express";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";

import db from "./models/index.js";
import noticiasRouter from "./routes/noticia.routes.js";
import authRouter from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

// ========= Parsers de body =========
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ========= Proxy / Sesión =========
app.set("trust proxy", 1); // si hay proxy (nginx, Heroku, etc.)

app.use(
  session({
    secret: process.env.SESSION_SECRET || "howard",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,           // HTTPS obligatorio en producción
      sameSite: isProd ? "none" : "lax", // cookies cross-site en producción
      maxAge: 1000 * 60 * 60 * 8, // 8 horas
    },
  })
);

// ========= CORS =========
if (!process.env.FRONT_ORIGIN) {
  console.warn("⚠️  Variable FRONT_ORIGIN no definida. Usando http://localhost:3001");
}
app.use(
  cors({
    origin: process.env.FRONT_ORIGIN || "http://localhost:3001", // frontend remoto o local
    credentials: true, // importante para que envíe cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========= Manejo de JSON inválido =========
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON inválido:", err.message);
    return res.status(400).json({ ok: false, message: "JSON inválido" });
  }
  next();
});

// ========= Archivos estáticos =========
const IMAGES_DIR = path.join(process.cwd(), "public/images/noticias");
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
app.use("/images/noticias", express.static(IMAGES_DIR));

// ========= Multer (uploads) =========
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, IMAGES_DIR);
  },
  filename: function (req, file, cb) {
    // Guarda la imagen con el ID de la noticia + extensión
    cb(null, req.params.id + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });

// ========= DB Sync =========
const syncOptions = {};
if (process.env.DB_FORCE_SYNC === "false") {
  syncOptions.force = true;
}

db.sequelize
  .sync(syncOptions)
  .then(() => console.log("✅ Base de datos sincronizada"))
  .catch((err) => console.error("❌ Error al sincronizar DB:", err));

// ========= Rutas =========
app.use("/api/auth", authRouter);
app.use("/api/noticias", noticiasRouter);

// ========= Arranque =========
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
