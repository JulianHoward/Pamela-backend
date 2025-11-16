import { Sequelize } from "sequelize";
import dbConfig from "../config/db.js";
import noticiaModel from "./noticia.model.js";

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    port: dbConfig.PORT,
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.noticias = noticiaModel(sequelize, Sequelize);

export default db;
