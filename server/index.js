import express from "express"
import { Server } from "socket.io"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3500

const app = express()

app.use(express.static(path.join(__dirname, "public")))

const expressServer = app.listen(PORT, () => {
  console.log(`Listenning on port ${PORT}`)
})

const io = new Server(expressServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? false :
    ["http://localhost:5500", "http://127.0.0.1:5500"]
  }
})

io.on('connection', socket => {
  console.log(`User ${socket.id} connected`)

  // A la connexion envoie un message à l'utilisateur
  socket.emit('message', "Welcome to Chat App!")

  // A la connexion envoie un message à tous les autres utilisateurs
  socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} is connected`)

  // Ecoute les evenements sur les messages
  socket.on('message', data => {
    console.log(data)
    io.emit('message', `${socket.id.substring(0,5)}: ${data}`)
  })

  // Ecoute quand un utilisateur se déconnecte
  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} is disconnected` )
  })

  // Ecoute l'activity d'un utilisateur
  socket.on('activity', (name) => {
    socket.broadcast.emit('activity', name )
  })
})
