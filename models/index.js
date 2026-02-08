import { Sequelize } from "sequelize";
import dbConfig from "../config/db.js";
import noticiaModel from "./noticia.model.js";

const sequelize = new Sequelize(dbConfig.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.noticias = noticiaModel(sequelize, Sequelize);

export default db;
