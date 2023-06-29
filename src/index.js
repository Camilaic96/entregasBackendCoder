const router = require('./router/app.js');
const { PORT } = require('./config');
const { app } = require('./app.js');

router(app);

app.listen(PORT, () => {
	console.log(`Server running at port ${PORT}`);
});
