// import io from 'socket.io-client'

console.log('This works!')
const socket = io('wss://cscloud8-79.lnu.se')

/**
 * Handles incoming messages from the server
 */
socket.on('message', (data) => {
  handleIssue(data)
})

/**
 * Handles incoming popups from the server
 */
socket.on('popupUp', (data) => {
  createGeneralPopUp(data)
})

/**
 * Handles the issue depending on the action
 *
 * @param {*} data - The attributes of the issue
 */
function handleIssue (data) {
  try {
    if (data.object_attributes.action === 'open' || data.object_attributes.action === 'reopen') {
      const messagesDiv = document.querySelector('.messages')

      const issueDiv = document.createElement('div')
      issueDiv.classList.add('repo')

      const currUrl = window.location.href.split('/')

      issueDiv.id = data.object_attributes.iid
      issueDiv.innerHTML += `<h1>Title: ${data.object_attributes.title}</h1>`
      issueDiv.innerHTML += `<p>Description: ${data.object_attributes.description}</p>`
      issueDiv.innerHTML += `<form action='/repo/${currUrl[4]}/close/${data.object_attributes.iid}' method='post'><input type='hidden' name='id' value=${data.object_attributes.iid}></input><input type='submit' value='Close Issue'></input></form>`

      messagesDiv.prepend(issueDiv)
    } else if (data.object_attributes.action === 'close') {
      console.log(data.object_attributes.iid)
      const issueDiv = document.getElementById(data.object_attributes.iid)
      issueDiv.classList.add('closed')

      setTimeout(() => {
        issueDiv.remove()
      }, 1000)
    } else if (data.object_attributes.action === 'update') {
      const currUrl = window.location.href.split('/')
      const issueDiv = document.getElementById(data.object_attributes.iid)
      issueDiv.innerHTML = `<h2>Title: ${data.object_attributes.title}</h2>`
      issueDiv.innerHTML += `<p>Description: ${data.object_attributes.description}</p>`
      issueDiv.innerHTML += `<form action='/repo/${currUrl[4]}/close/${data.object_attributes.iid}' method='post'><input type='hidden' name='id' value=${data.object_attributes.iid}></input><input type='submit' value='Close Issue'></input></form>`
    }
  } catch (error) {
    console.log(error)
  }
  createGeneralPopUp(data)
}

/**
 * Creates a popup that shows relevant data from the event hook
 *
 * @param {*} data - The data that was sent from the server
 */
function createGeneralPopUp (data) {
  const issuePopup = document.querySelector('.issue-popup')
  const issuePopupItem = document.createElement('div')

  issuePopupItem.classList.add('issue-popup-item')
  if (data.object_kind === 'push') {
    issuePopupItem.innerHTML += '<h2>Push event!</h2>'
    issuePopupItem.innerHTML += `<p>Author: ${data.user_name}</p>`
    issuePopupItem.innerHTML += `<p>Branch: ${data.ref}</p>`
    issuePopupItem.innerHTML += `<p>Commit message: ${data.commits[0].message}</p>`
  } else if (data.object_kind === 'issue') {
    issuePopupItem.innerHTML += '<h2>Issue event!</h2>'
    issuePopupItem.innerHTML += `<p>Title: ${data.object_attributes.title}</p>`
    issuePopupItem.innerHTML += `<p>Description: ${data.object_attributes.description}</p>`
  } else if (data.object_kind === 'note') {
    issuePopupItem.innerHTML += '<h2>Note event!</h2>'
    issuePopupItem.innerHTML += `<p>Author: ${data.user.name}</p>`
    issuePopupItem.innerHTML += `<p>Note: ${data.object_attributes.note}</p>`
  }

  issuePopup.prepend(issuePopupItem)
  setTimeout(() => {
    issuePopupItem.remove()
  }, 3000)
}
