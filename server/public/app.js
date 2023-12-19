// Initialise les websocket sur le port 3000
const socket = io('ws://localhost:3500')

const msgInput = document.querySelector('#message')
const nameInput = document.querySelector('#name')
const chatRoom = document.querySelector('#room')
const activity = document.querySelector('.activity')
const usersList = document.querySelector('.user-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')

// Envoi d'un message
function sendMessage(e) {
  e.preventDefault()   // Retire le comportement de rafraichissement de la page par défaut

  // Selectionne la balise input et envoie la valeur de l'input puis remet la chaine vide
  if (nameInput.value && msgInput.value && chatRoom.value) {
    socket.emit('message', {
        name: nameInput.value,
        text: msgInput.value
    })
    msgInput.value = ""
  }
  msgInput.focus()
}

//
function enterRoom(e) {
  e.preventDefault()
  if (nameInput.value && chatRoom.value) {
    socket.emit('enterRoom', {
        name: nameInput.value,
        room: chatRoom.value
    })
  }
}

// Ecoute notre formulaire et utilise la fonction d'envoi de message lors d'un event
document.querySelector('.form-chat')
    .addEventListener('submit', sendMessage)

document.querySelector('.form-join')
    .addEventListener('submit', enterRoom)

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value)
})

// Ecoute les messages
socket.on("message", (data) => {
  activity.textContent = ""
  const { name, text, time } = data
  const li = document.createElement('li')
  li.className = 'post'
  if (name === nameInput.value) li.className = 'post post--right'
  if (name !== nameInput.value && name !== 'Admin') li.className = 'post post--left'
  if (name !== 'Admin') {
      li.innerHTML = `<div class="post__header ${name === nameInput.value
          ? 'post__header--user'
          : 'post__header--reply'
          }">
      <span class="post__header--name">${name}</span>
      <span class="post__header--time">${time}</span>
      </div>
      <div class="post__text">${text}</div>`
  } else {
      li.innerHTML = `<div class="post__text italic">${text}</div>`
  }

  // bg-stone-100 text-li

  document.querySelector('.chat-display').appendChild(li)

  chatDisplay.scrollTop = chatDisplay.scrollHeight
})

let activityTimer
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`
  activity.style.opacity = 1
  clearTimeout(activityTimer)
  activityTimer = setTimeout(() => {
    activity.style.opacity = 0
  }, 2000);
})

socket.on('userList', ({ users }) => {
  showUsers(users)
})

socket.on('roomList', ({ rooms }) => {
  showRooms(rooms)
})

function showUsers(users) {
  usersList.textContent = ''
  if (users) {
      usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
      users.forEach((user, i) => {
          usersList.textContent += ` ${user.name}`
          if (users.length > 1 && i !== users.length - 1) {
              usersList.textContent += ","
          }
      })
  }
}

function showRooms(rooms) {
  roomList.textContent = ''
  if (rooms) {
      roomList.innerHTML = '<em>Active Rooms:</em>'
      rooms.forEach((room, i) => {
          roomList.textContent += ` ${room}`
          if (rooms.length > 1 && i !== rooms.length - 1) {
              roomList.textContent += ","
          }
      })
  }
}
