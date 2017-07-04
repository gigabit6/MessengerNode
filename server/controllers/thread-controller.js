let mongoose = require('mongoose')
let Thread = mongoose.model('Thread')
let Message = mongoose.model('Message')
let User = mongoose.model('User')
const errorHandler = require('../utilities/error-handler')
const messagesHelper = require('../utilities/message-helper')

module.exports = {
  searchThreadsByUser: (req, res) => {
    let username = req.query.searchUsername

    User
    .find({username: { '$regex': username, '$options': 'i' }})
    .then((users) => {
      res.render('threads/threadsUser', {users: users})
    })
  },
  threadGet: (req, res) => {
    let username = req.params.username
    if (username === req.user.username) {
      res.locals.globalError = 'You cant send messages to Yourself!'
      res.render('home/index')
      return
    }
    User
    .findOne({username: username}).then(user => {
      Thread
        .findOne({ users: { $all: [user._id, req.user._id] } }).then(thread => {
          if (!thread) {
            Thread
              .create({
                users: [user._id, req.user._id]
              })
              .then(thread => {
                thread.notBlocked = true
                res.render('threads/thread', {thread: thread, user: user})
              })
              .catch(err => {
                let message = errorHandler.handleMongooseError(err)
                res.locals.globalError = message
                res.render('home/index')
              })
          } else {
            Message
              .find({thread: thread._id})
              .populate('user')
              .sort('creationDate')
              .then(messages => {
                if (thread.isBlockedBy && thread.isBlockedBy.equals(req.user._id)) {
                  thread.allowUnblock = true
                } else if (thread.isBlockedBy && !thread.isBlockedBy.equals(req.user._id)) {
                  thread.blocked = true
                } else {
                  thread.notBlocked = true
                }
                messagesHelper(messages, req)
                res.render('threads/thread', {messages: messages, thread: thread, user: user})
              })
          }
        })
    })
  }
}
