import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const requestHandler = {}
export default requestHandler

/**
 * @description Handles the request to the API
 * @returns {object} Returns a object with the data from the API
 */
requestHandler.init = async () => {
  const request = await fetch('https://gitlab.lnu.se/api/v4/projects/31021/issues',
    {
      method: 'GET',
      headers: {
        'PRIVATE-TOKEN': process.env.GITLAB_TOKEN
      }
    })
  const data = await request.json()
  return data
}

/**
 * @description Handles the request to the API for getting user data
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {object} Returns a object with the data from the API
 */
requestHandler.getUser = async (req, res) => {
  const request = await fetch(`https://gitlab.lnu.se/api/v4/user?access_token=${req.session.auth.access_token}`)
  const data = await request.json()
  return data
}

/**
 * @description Handles the request to the API for retrieving repositories
 * @param {*} req - The request object
 * @returns {object} Returns a object with the data from the API
 */
requestHandler.getRepos = async (req) => {
  const request = await fetch(`https://gitlab.lnu.se/api/v4/projects?access_token=${req.session.auth.access_token}&membership=true`)
  const data = await request.json()
  return data
}

/**
 * @description Handles the request to the API for retrieving issues
 * @param {*} req - The request object
 * @returns {object} Returns a object with the data from the API
 */
requestHandler.getIssues = async (req) => {
  const request = await fetch(`https://gitlab.lnu.se/api/v4/projects/${req.params.id}/issues?access_token=${req.session.auth.access_token}`)
  const data = await request.json()
  return data
}

/**
 * @description Handles the request to the API for closing an issue
 * @param {*} req - The request object
 * @returns {object} Returns a object with the data from the API
 */
requestHandler.closeIssue = async (req) => {
  const request = await fetch(`https://gitlab.lnu.se/api/v4/projects/${req.params.id}/issues/${req.body.id}?access_token=${req.session.auth.access_token}&state_event=close`, {
    method: 'PUT'
  })
  const data = await request.json()
  return data
}

/**
 * @description Handles the request to the API for creating a new issue
 * @param {*} req - The request object
 * @returns {object} Returns a object with the data from the API
 */
requestHandler.createIssue = async (req) => {
  const params = new URLSearchParams({
    title: req.body.title,
    description: req.body.description
  })

  const request = await fetch(`https://gitlab.lnu.se/api/v4/projects/${req.params.id}/issues?access_token=${req.session.auth.access_token}`, {
    method: 'POST',
    body: params.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  const data = await request.json()
  return data
}

/**
 * @description Handles the request to the API for retrieving the token
 * @param {*} req - The request object
 * @param {*} res - The response object
 */
requestHandler.tokenHandler = async (req, res) => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.CLIENT_ID,
    code: req.query.code,
    redirect_uri: process.env.REDIRECT_URI,
    client_secret: process.env.CLIENT_SECRET
  })

  await fetch('https://gitlab.lnu.se/oauth/token', {
    method: 'POST',
    body: params.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(data => data.json())
    .then(response => {
      req.session.auth = response
    })
}

requestHandler.createWebhook = async (req) => {
  await fetch(`https://gitlab.lnu.se/api/v4/projects/${req.session.auth.repoid}/hooks?access_token=${req.session.auth.access_token}`, {
    method: 'POST',
    body: JSON.stringify({
      url: 'https://cscloud8-79.lnu.se/webhook',
      push_events: true,
      note_events: true,
      issues_events: true,
      release_events: true,
      token: process.env.SECRET_TOKEN,
      enable_ssl_verification: true
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

requestHandler.deleteWebhook = async (req) => {
  if (!req.session) return
  if (!req.session.auth) return
  if (!req.session.auth.repoid) return
  await fetch(`https://gitlab.lnu.se/api/v4/projects/${req.session.auth.repoid}/hooks?access_token=${req.session.auth.access_token}`, {
    method: 'GET'
  }).then(data => data.json())
    .then(response => {
      const hook = response.filter(hook => hook.url === 'https://cscloud8-79.lnu.se/webhook')
      if (hook.length === 0) return
      req.session.auth.hookid = response.filter(hook => hook.url === 'https://cscloud8-79.lnu.se/webhook')[0].id
    })

  await fetch(`https://gitlab.lnu.se/api/v4/projects/${req.session.auth.repoid}/hooks/${req.session.auth.hookid}?access_token=${req.session.auth.access_token}`, {
    method: 'DELETE'
  })
}
