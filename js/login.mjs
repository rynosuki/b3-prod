// import io from 'socket.io-client'

const socket = io('wss://cscloud8-79.lnu.se')

/**
 * Handles incoming messages from the server
 */
socket.on('message', (data) => {
  createGeneralPopUp(data)
})

/**
 * Creates a popup that shows relevant data from the event hook
 */
socket.on('popupUp', (data) => {
  createGeneralPopUp(data)
})

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
