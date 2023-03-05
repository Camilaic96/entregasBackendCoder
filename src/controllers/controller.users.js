const { Router } = require('express')
const User = require('../dao/models/User.model')

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

        const newUser = await User.create(newUserInfo)

        res.status(201).json({ message: newUser })
    } catch (error) {
        if(error.code === 11000) return res.status(400).json({ error: 'El usuario ya existe'})
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = router