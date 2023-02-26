const { Router } = require('express');
const MessagesDao = require('../dao/Message.dao.js')
const Message = new MessagesDao('Messages.json');
const FilesDao = require('../dao/Files.dao')
const MessageManager = new FilesDao('Messages.json')

const router = Router();

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find()
        res.json( { response: messages })
        /*
        const messages = messagesBD.map(({ user, message }) => ({
            user,
            message
        }))
        
        global.io.emit('messageLogs', messages )
        res.render('chat.handlebars', {})*/
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.post('/populate', async (req, res) => {
    const messages = await MessageManager.loadItems()
    const response = await Message.insertMany(messages)
    res.json({ message: response })
})

router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body;
        if (!user || !message) {
            return res.status(400).json({ error: 'Faltan datos' });
        }
        const newMessage = {
            user,
            message
        }
        
        const response = await Message.create(newMessage)
    
        res.json({ message: response })
    } catch (error) {
        res.status(400).json({ error })
    }
})

//Delete all messages bd
router.delete('/', async (req, res) => {
    await Message.deleteMany()
    res.json({ message: 'Todos los productos eliminados' })
})

module.exports = router;