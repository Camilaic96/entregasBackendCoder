const Route = require('../router/router');

class LoggerTestRouter extends Route {
	init() {
		this.get('/fatal', ['PUBLIC'], async (req, res) => {
			try {
				req.logger.fatal('fatal level test');
				res.json({ message: 'fatal level test' });
			} catch (error) {
				res.sendServerError(`fatal level test failed. Error: ${error}`);
			}
		});
		this.get('/error', ['PUBLIC'], async (req, res) => {
			try {
				req.logger.error('error level test');
				res.json({ message: 'error level test' });
			} catch (error) {
				res.sendServerError(`error level test failed. Error: ${error}`);
			}
		});
		this.get('/warning', ['PUBLIC'], async (req, res) => {
			try {
				req.logger.warning('warning level test');
				res.json({ message: 'warning level test' });
			} catch (error) {
				res.sendServerError(`warning level test failed. Error: ${error}`);
			}
		});
		this.get('/info', ['PUBLIC'], async (req, res) => {
			try {
				req.logger.info('info level test');
				res.json({ message: 'info level test' });
			} catch (error) {
				res.sendServerError(`info level test failed. Error: ${error}`);
			}
		});
		this.get('/http', ['PUBLIC'], async (req, res) => {
			try {
				req.logger.http('http level test');
				res.json({ message: 'http level test' });
			} catch (error) {
				res.sendServerError(`http level test failed. Error: ${error}`);
			}
		});
		this.get('/debug', ['PUBLIC'], async (req, res) => {
			try {
				req.logger.debug('debug level test');
				res.json({ message: 'debug level test' });
			} catch (error) {
				res.sendServerError(`debug level test failed. Error: ${error}`);
			}
		});
	}
}

const loggerTestRouter = new LoggerTestRouter();
const loggerTestController = loggerTestRouter.getRouter();

module.exports = loggerTestController;
