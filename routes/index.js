import authRouter from "./routes/auth.routes.js";
import noticiasRouter from "./routes/noticia.routes.js";

app.use("/api/auth", authRouter); // Login y rutas auth
app.use("/api/noticias", noticiasRouter); // Noticias
