const router = require('./router/app.js');
const { port } = require('./config');
const { app } = require('./app.js');

router(app);

app.listen(port, () => {
	console.log(`Server running at port ${port}`);
});
