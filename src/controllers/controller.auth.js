const { Router } = require('express')
const UserDao = require('../dao/mongoManager/User.dao');
const User = new UserDao();

const router = Router()

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body
        
        const user = await User.findOne({ email })

        if(!user || user.password !== password) return res.status(400).json({ error: 'Username and password do not match' })

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email
        }

        res.redirect('/api/products')
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.json({ error })

        res.redirect('/api/login')
    })
})

module.exports = router