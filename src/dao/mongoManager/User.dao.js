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

    async findById(id) {
        try {
            const user = await User.findById(id)
            return user
        } catch (error) {
            return error
        }
    }

    async create(newUser) {
        try {
            await User.create(newUser)
            return 'User created'
        } catch (error) {
            return error
        }
    }

    async updateOne(data, newData) {
        try {
            const user = await User.updateOne(data, newData)
            return user
        } catch (error) {
            return error
        }
    }
}

module.exports = UserDao;