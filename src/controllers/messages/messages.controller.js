const Route = require('../../router/router');

const MessageDao = require('../../dao/mongo/mongoManager/Message.dao');
const Message = new MessageDao('Messages.json');
const FilesDao = require('../../dao/memory/Files.dao');
const MessageManager = new FilesDao('Messages.json');

class MessageRouter extends Route {
	init() {
		this.get('/', ['USER'], (req, res) => {
			res.render('chat.handlebars', {});
		});

		// Add all messages from fs to the database
		this.post('/populate', ['USER'], async (req, res) => {
			const messages = await MessageManager.loadItems();
			const response = await Message.insertMany(messages);
			res.json({ message: response });
		});

		this.post('/', ['USER'], async (req, res) => {
			try {
				const { user, message } = req.body;
				if (!user || !message) {
					return res.status(400).json({ error: 'Incomplete data' });
				}
				const newMessage = {
					user,
					message,
				};

				const response = await Message.create(newMessage);

				res.json({ message: response });
			} catch (error) {
				res.status(400).json({ error });
			}
		});

		// Delete all messages bd
		this.delete('/', ['ADMIN'], async (req, res) => {
			await Message.deleteMany();
			res.json({ message: 'All messages deleted' });
		});
	}
}

const messageRouter = new MessageRouter();
const messagesController = messageRouter.getRouter();

module.exports = messagesController;
