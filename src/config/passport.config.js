const passport = require('passport')
const local = require('passport-local')
const GitHubStrategy = require('passport-github2')
const UserDao = require('../dao/mongoManager/User.dao');
const { createHash, isValidPasswordMethod } = require('../utils/cryptPassword')

const User = new UserDao();
const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body
            try {
                const user = await User.findOne({ email: username })

                if(user) {
                    console.log('User already exists')
                    return done(null, false)
                }

                const newUserInfo = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }

                const newUser = await User.create(newUserInfo)
                return done(null, newUser)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
    })

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async(username, password, done) => {
        try {
            const user = await User.findOne({ email: username })

            if(!user) {
                console.log('User not found')
                return done(null, false)
            }

            if(!isValidPasswordMethod(password, user)) return done(null, false)

            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.db5e6697a3108455',
        clientSecret: 'e0e37655227c9f5d195827f286c7e669f8294f1e',
        callbackURL: 'http://localhost:8080/api/auth/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({email: profile._json.email})
            if(!user) {
                const newUserInfo = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password: ''
                }
                const newUser = await User.create(newUserInfo)

                return done(null, newUser)
            }
            done(null, user)
        } catch (error) {
            done(error)
        }
    }))
}

module.exports = initializePassport