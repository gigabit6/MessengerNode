const home = require('./home-controller')
const users = require('./users-controller')
const threads = require('./thread-controller')
const messages = require('./message-controller')

module.exports = {
  home: home,
  users: users,
  threads: threads,
  messages: messages
}
