export default (sequelize, Sequelize) => {
  return sequelize.define("noticia", {
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contenido: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    imagen_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    imagen: {
      type: Sequelize.VIRTUAL,
      get() {
        return this.imagen_url || `http://localhost:3000/images/noticias/${this.id}.jpg`;
      },
    },
    creado_en: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
};
