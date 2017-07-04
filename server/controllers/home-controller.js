let mongoose = require('mongoose')
let Thread = mongoose.model('Thread')

module.exports = {
  index: (req, res) => {
    if (!req.user) {
      res.render('home/index')
    } else {
      Thread
        .find({users: req.user._id})
        .populate('users')
        .sort('-creationDate')
        .then(threads => {
          for (let thread of threads) {
            for (let user of thread.users) {
              if (!user._id.equals(req.user._id)) {
                user.toLinkThread = true
              }
            }
          }
          res.render('home/threads', {threads: threads})
        })
    }
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
