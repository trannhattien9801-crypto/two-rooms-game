const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let players = []

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

// 2 vai bắt buộc
let gameRoles = [
"tongthong",
"boom"
]

// các vai khác
let extraRoles = [

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
"camxanh"

]

// trộn vai phụ
extraRoles = extraRoles.sort(()=>Math.random()-0.5)

// thêm vai phụ theo số người
for(let i=0;i<players.length-2;i++){

gameRoles.push(extraRoles[i] || "doixanh")

}

// nếu vẫn thiếu thì thêm dân thường
while(gameRoles.length < players.length){

if(Math.random()>0.5){
gameRoles.push("doixanh")
}else{
gameRoles.push("doido")
}

}

// trộn lại toàn bộ role
gameRoles = gameRoles.sort(()=>Math.random()-0.5)

// chia role
players.forEach((p,i)=>{

p.role = gameRoles[i]

io.to(p.id).emit("yourRole",p.role)

})

// gửi role cho host
io.emit("gameStarted",players)

})


// người chơi rời game
socket.on("disconnect",()=>{

players = players.filter(p=>p.id !== socket.id)

io.emit("updatePlayers",players)

})

})

server.listen(3000,()=>{
console.log("Server running on port 3000")
})