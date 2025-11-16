import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/noticias");
  },
  filename: function (req, file, cb) {
    cb(null, req.params.id + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
