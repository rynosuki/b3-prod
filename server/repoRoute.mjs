import express from 'express'
import requestHandler from './requestHandler.mjs'

const controller = {}
export default controller

controller.router = express.Router()

/**
 * @description Handles the index route for a repository
 */
controller.router.get('/:id', async (req, res) => {
  const issues = await requestHandler.getIssues(req)
  req.session.auth.repoid = req.params.id
  await requestHandler.createWebhook(req)
  res.render('repoShowcase', { title: 'Repository', issues, body: req.session.auth ? req.session.auth : null, repoid: req.params.id })
})

/**
 * @description Handles the closing of an issue
 */
controller.router.post('/:id/close/:iid', async (req, res) => {
  await requestHandler.closeIssue(req)
  console.log(req.params)
  res.redirect(`/repo/${req.params.id}`)
})

/**
 * @description Handles the creation of a new issue
 */
controller.router.post('/:id/create', async (req, res) => {
  await requestHandler.createIssue(req)
  res.redirect(`/repo/${req.params.id}`)
})
