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
"nguoicam",
"doido",
"doixanh"
]

io.on("connection",(socket)=>{

console.log("Player connected")

// người chơi tham gia
socket.on("join",(name)=>{

players.push({
id:socket.id,
name:name,
role:null
})

io.emit("updatePlayers",players)

})

// host bắt đầu game
socket.on("startGame",(count)=>{

// trộn vai
let shuffled=[...roles].sort(()=>Math.random()-0.5)

// chia vai cho người chơi
players.forEach((p,i)=>{

p.role = shuffled[i] || "doixanh"

// gửi role cho player
io.to(p.id).emit("yourRole",p.role)

})

// gửi danh sách role cho host
io.emit("gameStarted",players)

})

// khi người chơi rời
socket.on("disconnect",()=>{

players = players.filter(p=>p.id !== socket.id)

io.emit("updatePlayers",players)

})

})

server.listen(3000,()=>{
console.log("Server running on port 3000")
})