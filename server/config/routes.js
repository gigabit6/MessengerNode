const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', auth.isAuthenticated, controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.get('/thread/:username', auth.isAuthenticated, controllers.threads.threadGet)

  app.get('/search', controllers.threads.searchThreadsByUser)

  app.post('/add', auth.isAuthenticated, controllers.messages.addPost)

  app.post('/block/:username', auth.isAuthenticated, controllers.users.block)
  app.post('/unblock/:username', auth.isAuthenticated, controllers.users.unblock)

  app.post('/like/:id', auth.isAuthenticated, controllers.messages.like)
  app.post('/unlike/:id', auth.isAuthenticated, controllers.messages.unlike)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
