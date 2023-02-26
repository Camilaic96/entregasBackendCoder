const fs = require('fs');
const Message = require('./models/Messages.model')

class MessageDao {
    constructor(file) {
        this.file = `${process.cwd()}/src/files/${file}`
    }

    async getMessages() {
        try {
            if (fs.existsSync(this.file)) {
                const data = await fs.promises.readFile(this.file, 'utf-8');
                const messages = JSON.parse(data);
                return messages;
            }
            return []
        } catch (error) {
            console.log(error)
        }
    }

    async find() {
        try {
            const messages = await Message.find()
            return messages
        } catch (error) {
            return error
        }
    }
    
    async insertMany(newMessages) {
        try {
            const messages = await Message.insertMany(newMessages)
            return messages
        } catch (error) {
            return error
        }
    }

    async create(newMessage) {
        try {
            await Message.create(newMessage)
            return 'Mensaje creado'
        } catch (error) {
            return error
        }
    }

    async deleteMany() {
        try {
            await Message.deleteMany()
            return 'Mensajes eliminados'
        } catch (error) {
            return error
        }
    }
}

module.exports = MessageDao;