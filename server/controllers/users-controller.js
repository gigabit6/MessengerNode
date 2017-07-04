const encryption = require('../utilities/encryption')
let mongoose = require('mongoose')
let Thread = mongoose.model('Thread')
const User = mongoose.model('User')
const errorHandler = require('../utilities/error-handler')
const userValidation = require('../utilities/user-validation')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body

    let errors = userValidation.validate(reqUser)
    if (errors !== '') {
      res.locals.globalError = errors
      res.render('users/register', reqUser)
      return
    }

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('users/register', reqUser)
      })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User
      .findOne({ username: reqUser.username }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  block: (req, res) => {
    let username = req.params.username
    User
      .findOne({username: username}).then(user => {
        Thread
          .findOne({ users: { $all: [user._id, req.user._id] } })
          .then(thread => {
            thread.isBlockedBy = req.user._id
            thread.save().then((thread) => {
              res.redirect(`/thread/${username}`)
            })
          })
      })
  },
  unblock: (req, res) => {
    let username = req.params.username
    User
      .findOne({username: username}).then(user => {
        Thread
          .findOne({ users: { $all: [user._id, req.user._id] } })
          .then(thread => {
            thread.isBlockedBy = undefined
            thread.save().then((thread) => {
              res.redirect(`/thread/${username}`)
            })
          })
      })
  }
}
