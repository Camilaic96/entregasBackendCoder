/* eslint-disable n/no-path-concat */
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const possibleDest = {
			profile: 'profiles',
			product: 'products',
			identificacion: 'documents',
			comprobanteDomicilio: 'documents',
			comprobanteCuenta: 'documents',
		};

		const { email } = req.user;

		const destFolder = possibleDest[file.fieldname];

		const path = `${process.cwd()}/src/files/${destFolder}`;

		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}

		if (!fs.existsSync(`${path}/${email}`)) {
			fs.mkdirSync(`${path}/${email}`);
		}

		cb(null, `${path}/${email}`);

		// cb(null, __dirname + '/public/img');
	},
	filename: (req, file, cb) => {
		const type = file.originalname.split('.')[1];

		cb(null, `${file.fieldname}.${type}`);

		// cb(null, file.originalname);
	},
});

const uploader = multer({ storage });

module.exports = uploader;
