let mongoose = require('mongoose')
let Message = mongoose.model('Message')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addPost: (req, res) => {
    let messageReq = req.body
    Message
      .create({
        user: req.user._id,
        content: messageReq.content,
        thread: messageReq.thread
      }).then(message => {
        res.redirect(`/thread/${messageReq.user}`)
      })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('home/index')
      })
  },
  like: (req, res) => {
    let id = req.params.id
    Message
    .findByIdAndUpdate(id, {isLiked: true})
    .then(message => {
      res.redirect(`/thread/${req.body.user}`)
    })
  },
  unlike: (req, res) => {
    let id = req.params.id
    Message
    .findByIdAndUpdate(id, {isLiked: false})
    .then(message => {
      res.redirect(`/thread/${req.body.user}`)
    })
  }
}
