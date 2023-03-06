const { Router } = require('express')
const UserDao = require('../dao/mongoManager/User.dao');
const User = new UserDao();

const router = Router()

router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, age, email, password, role } = req.body

        const newUserInfo = {
            first_name,
            last_name,
            age,
            email,
            password,
            role
        }

        await User.create(newUserInfo)

        res.redirect('/api/products')
    } catch (error) {
        if(error.code === 11000) return res.status(400).json({ error: 'The user already exists'})
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.post('/admin', async (req, res) => {
    try {
        const newUserInfoAdmin = {
            first_name: 'Admin',
            last_name: 'Coder',
            age: 0,
            email: 'adminCoder@coder.com',
            password: 'adminCod3r123',
            role: 'admin'
        }

        await User.create(newUserInfoAdmin)

        res.json({ message: 'Usuario admin creado'})
    } catch (error) {
        if(error.code === 11000) return res.status(400).json({ error: 'The user already exists'})
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router