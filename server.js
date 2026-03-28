const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let players = []

io.on("connection",(socket)=>{

socket.on("join",(name)=>{

players.push({
id:socket.id,
name:name,
role:null,
item:null
})

io.emit("updatePlayers",players)

})


// START GAME
socket.on("startGame",()=>{

// vai bắt buộc
let gameRoles = [
"tongthong",
"boom"
]

// vai phụ
let extraRoles = [

"bomtit",

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

// trộn
extraRoles = extraRoles.sort(()=>Math.random()-0.5)

// thêm role
for(let i=0;i<players.length-2;i++){
gameRoles.push(extraRoles[i] || "doixanh")
}

// thêm dân thường nếu thiếu
while(gameRoles.length < players.length){

if(Math.random()>0.5){
gameRoles.push("doixanh")
}else{
gameRoles.push("doido")
}

}

// trộn role
gameRoles = gameRoles.sort(()=>Math.random()-0.5)

// gán role
players.forEach((p,i)=>{
p.role = gameRoles[i]
p.item = null
})

// =======================
// 🎒 ITEM THIẾT BỊ NỔ
// =======================

// xác định phe đỏ
const redRoles = [

"giandiep",
"satthu",

"keluadao",
"kephahoai",
"camdo",
"doido"
]

let redPlayers = players.filter(p => redRoles.includes(p.role))

// trộn
redPlayers = redPlayers.sort(()=>Math.random()-0.5)

// gán tối đa 3 thiết bị nổ
for(let i=0;i<3 && i<redPlayers.length;i++){
redPlayers[i].item = "thietbino"
}

// =======================

// gửi role + item
players.forEach(p=>{

io.to(p.id).emit("yourRole",{
role:p.role,
item:p.item
})

})

// gửi cho host
io.emit("gameStarted",players)

})


// disconnect
socket.on("disconnect",()=>{

players = players.filter(p=>p.id !== socket.id)

io.emit("updatePlayers",players)

})

})

server.listen(3000,()=>{
console.log("Server running")
})