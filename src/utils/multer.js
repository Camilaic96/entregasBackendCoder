/* eslint-disable n/no-path-concat */
/* ARREGLAR */
// El middleware de multer deberá estar modificado para que pueda guardar en diferentes carpetas los diferentes archivos que se suban. Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar un documento, multer los guardará en una carpeta documents.

const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __dirname + '/public/img');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const uploader = multer({ storage });

module.exports = uploader;
