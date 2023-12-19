// Initialise les websocket sur le port 3000
const socket = io('ws://localhost:3500')

const activity = document.querySelector('.activity')
const msgInput = document.querySelector('input')

// Envoi d'un message
function sendMessage(e) {
  // Retire le comportement de rafraichissement de la page par défaut
  e.preventDefault()

  // Selectionne la balise input et envoie la valeur de l'input puis remet la chaine vide
  if (msgInput.value) {
    socket.emit('message', msgInput.value)
    msgInput.value = ""
  }
  msgInput.focus()
}

// Ecoute notre formulaire et utilise la fonction d'envoi de message lors d'un event submit
document.querySelector('form').addEventListener('submit', sendMessage)

// Ecoute les messages
socket.on("message", (data) => {
  activity.textContent = ""
  const li = document.createElement('li')
  li.textContent = data
  li.classList.add("bg-stone-100", "text-sm", "p-2.5", "mb-2",
  "rounded-full", "rounded-tl-lg")
  document.querySelector('ul').appendChild(li)
})

msgInput.addEventListener('keypress', () => {
  socket.emit('activity', socket.id.substring(0, 5))
})

let activityTimer
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`
  clearTimeout(activityTimer)
  activityTimer = setTimeout(() => {
    activity.textContent = ""
  }, 2000);
})
