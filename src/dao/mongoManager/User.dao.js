const User = require('../models/User.model')

class UserDao {

    async findOne(param) {
        try {
            const user = await User.findOne(param)
            return user
        } catch (error) {
            return error
        }
    }

    async create(newUser) {
        try {
            await User.create(newUser)
            return 'Usuario creado'
        } catch (error) {
            return error
        }
    }
}

module.exports = UserDao;