const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const path = require("path")
const QRCode = require("qrcode")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
 res.sendFile(path.join(__dirname,"public","index.html"))
})

app.get("/qr", async (req,res)=>{

 const ip = req.headers.host
 const url = "http://" + ip

 const qr = await QRCode.toDataURL(url)

 res.send(`
  <html>
  <body style="text-align:center;font-family:sans-serif">
  <h2>Scan to Join Game</h2>
  <img src="${qr}" />
  <p>${url}</p>
  </body>
  </html>
 `)

})

let players = []

const roles = [
 "President",
 "Bomber",
 "Blue Team",
 "Blue Team",
 "Blue Team",
 "Red Team",
 "Red Team",
 "Red Team"
]

io.on("connection",(socket)=>{

 socket.on("join",(name)=>{
  players.push({id:socket.id,name})
  io.emit("players",players)
 })

 socket.on("start",()=>{

  const shuffled = roles.sort(()=>Math.random()-0.5)

  players.forEach((p,i)=>{
   io.to(p.id).emit("role",shuffled[i % shuffled.length])
  })

 })

 socket.on("disconnect",()=>{
  players = players.filter(p=>p.id!==socket.id)
  io.emit("players",players)
 })

})

server.listen(3000,()=>{
 console.log("Server running")
})