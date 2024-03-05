import express from 'express'
import requestHandler from './requestHandler.mjs'

const controller = {}
export default controller

controller.router = express.Router()

/**
 * @description Handles the index route
 */
controller.router.get('/', async (req, res) => {
  if (req.session.auth) {
    const repos = await requestHandler.getRepos(req)
    res.render('index', { title: 'Issue list', repos, body: req.session.auth ? req.session.auth : null })
  } else {
    res.render('index', { title: 'Issue list', body: req.session.auth ? req.session.auth : null })
  }
})

/**
 * @description Handles the webhook from GitLab and checks if the request is authorized
 */
controller.router.post('/webhook', (req, res) => {
  if (!req.headers['user-agent'].includes('GitLab') || !req.headers['x-gitlab-event'] || !req.headers['x-gitlab-instance'] === 'https://gitlab.lnu.se' ||
   !req.headers['x-gitlab-event-uuid'] || !req.headers['x-gitlab-token'] === process.env.SECRET_TOKEN) {
    res.status(301).send('Unauthorized')
    return
  }

  if (req.headers['x-gitlab-event'] === 'Issue Hook') {
    controller.io.emit('message', req.body)
    res.send('OK')
  } else {
    controller.io.emit('popupUp', req.body)
    res.send('OK')
  }
})

/**
 * @description Handles logout
 */
controller.router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

/**
 * @description Redirects the user to the OAuth provider
 */
controller.router.get('/login', (req, res) => {
  res.redirect(`https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${generateCodeVerifier()}`)
})

/**
 * @description Handles the callback from the OAuth provider
 */
controller.router.get('/oauth-callback', async (req, res) => {
  await requestHandler.tokenHandler(req, res)
  const data = await requestHandler.getUser(req, res)
  req.session.auth.name = data.name
  res.redirect('/')
})

/**
 * @description Generate a random string for the state parameter
 * @returns {string} A random string
 */
function generateCodeVerifier () {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
