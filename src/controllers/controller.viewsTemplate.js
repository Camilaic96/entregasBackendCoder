const { Router } = require('express')
const { privateAccess, publicAccess } = require('../middlewares')

const router = Router()

router.get('/', privateAccess, (req, res) => {
    console.log(req.session)
    const { user } = req.session
    console.log(user)
    res.render('products.handlebars', { user })
})

router.get('/login', publicAccess, (req, res) => {
    res.render('login.handlebars')
})

router.get('/signup', publicAccess, (req, res) => {
    res.render('signup.handlebars')
})

module.exports = router