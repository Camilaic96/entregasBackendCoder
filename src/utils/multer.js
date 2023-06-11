/* eslint-disable n/no-path-concat */
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

// El middleware de multer deberá estar modificado para que pueda guardar en diferentes carpetas los diferentes archivos que se suban. Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar un documento, multer los guardará en una carpeta documents.

/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        const possibleDest = {
            profile: "profiles",
            product: "products",
            documento: "documents",
            comprobanteDomicilio: "documents",
            comprobanteCuenta: "documents"
        }

        const {email} = req.user;
        
        const destFolder = possibleDest[file.fieldname];
        
        const path = `${process.cwd()}/src/files/${destFolder}`
        
        if(!fs.existsSync(path)){
            fs.mkdirSync(path)
        }
        
        if(!fs.existsSync(`${path}/${email}`)){
            fs.mkdirSync(`${path}/${email}`)
        }

        cb(null, `${path}/${email}`)
    },
    filename: (req, file, cb) => {
        
        const type = file.originalname.split(".")[1]

        cb(null, `${file.fieldname}.${type}`)
    }
})
*/
