const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let players = []

// danh sách vai trò
const roles = [

"tongthong",
"boom",
"bacsi",
"vesi",
"thamtu",
"phongvien",
"luatsu",
"kysu",
"giandiep",
"satthu",
"bantia",
"keluadao",
"kephahoai",
"nhatientri",
"bansao",
"conbac",
"camdo",
"camxanh",
"doido",
"doixanh"

]

io.on("connection",(socket)=>{

console.log("player connected")

socket.on("join",(name)=>{

players.push({
id:socket.id,
name:name,
role:null
})

io.emit("updatePlayers",players)

})

socket.on("startGame",(count)=>{

let shuffled=[...roles].sort(()=>Math.random()-0.5)

players.forEach((p,i)=>{

p.role = shuffled[i] || "doixanh"

io.to(p.id).emit("yourRole",p.role)

})

io.emit("gameStarted",players)

})

socket.on("disconnect",()=>{

players = players.filter(p=>p.id !== socket.id)

io.emit("updatePlayers",players)

})

})

server.listen(3000,()=>{
console.log("Server running on port 3000")
})