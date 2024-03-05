import express from 'express'
import morgan from 'morgan'
import routes from './routes.mjs'
import { Server } from 'socket.io'
import session from 'express-session'
import repoRoutes from './repoRoute.mjs'
import requestHandler from './requestHandler.mjs'

const app = express()
const PORT = process.env.PORT || 5000
const routing = routes
const repoRouting = repoRoutes

app.use(morgan('dev'))
app.use(express.json())
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))
app.set('trust proxy', 1)
app.use(session({
  secret: 'rynosuki',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use((req, res, next) => {
  io.on('connection', (socket) => {
    console.log('New client connected')
    socket.on('disconnect', () => {
      console.log('Client disconnected')
      requestHandler.deleteWebhook(req)
    })
  })
  next()
})

app.use((req, res, next) => {
  if (req.session.auth) {
    res.locals.user = req.session.auth
  }
  next()
})
app.use((req, res, next) => {
  if ((req.body.id && !req.session.auth) || (req.body.title && !req.session.auth)) {
    res.sendStatus(401)
    return
  }
  next()
})

app.use('/public', express.static('public'))
app.use('/js', express.static('js'))
app.use('/', routing.router)
app.use('/repo', repoRouting.router)

app.get('/error/', (req, res) => {
  process.exit(1)
})

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
export default server

const io = new Server(server)
routing.io = io
