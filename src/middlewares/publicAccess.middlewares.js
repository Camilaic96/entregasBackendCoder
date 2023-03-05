function publicAccess(req, res, next) {
    if(req.session.user) return res.redirect('/api')

    next()
}

module.exports = publicAccess