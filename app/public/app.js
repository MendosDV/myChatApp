// Initialise les websocket sur le port 3000
const socket = io('ws://localhost:3500')

// Envoi d'un message
function sendMessage(e) {
  // Retire le comportement de rafraichissement de la page par défaut
  e.preventDefault()

  // Selectionne la balise input et envoie la valeur de l'input puis remet la chaine vide
  const input = document.querySelector('input')
  if (input.value) {
    socket.emit('message', input.value)
    input.value = ""
  }
  input.focus()
}

// Ecoute notre formulaire et utilise la fonction d'envoi de message lors d'un event submit
document.querySelector('form')
  .addEventListener('submit', sendMessage)

// Ecoute les messages
socket.on("message", (data) => {
  const li = document.createElement('li')
  li.textContent = data
  li.classList.add("bg-stone-100", "text-sm", "p-2.5", "mb-2", "rounded-full", "rounded-tl-lg")
  document.querySelector('ul').appendChild(li)
})
