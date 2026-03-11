const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const path = require("path")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname,"public")))

let players=[]

io.on("connection",(socket)=>{

socket.on("join",(name)=>{

players.push({
id:socket.id,
name:name
})

io.emit("players",players)

})

socket.on("start",()=>{

let specialRoles=[

"Tổng Thống",
"Kẻ Đặt Bom",

"Bác Sĩ",
"Kỹ Sư",
"Vệ Sĩ",
"Thám Tử",
"Phóng Viên",
"Luật Sư",
"Chỉ Huy",
"Nhà Ngoại Giao",
"Người Gác Cửa",

"Gián Điệp",
"Sát Thủ",
"Bắn Tỉa",
"Kẻ Lừa Đảo",
"Kẻ Phá Hoại",

"Con Bạc",
"Nhà Đàm Phán",
"Nhà Tiên Tri",
"Bản Sao",

"Người Câm Xanh",
"Người Câm Đỏ"

]

let roles=[...specialRoles]

while(roles.length < players.length){

if(Math.random()>0.5){
roles.push("Đội Xanh")
}else{
roles.push("Đội Đỏ")
}

}

roles = roles.sort(()=>Math.random()-0.5)

players.forEach((p,i)=>{

io.to(p.id).emit("role",roles[i])

})

})

socket.on("disconnect",()=>{

players = players.filter(p=>p.id!==socket.id)

io.emit("players",players)

})

})

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
console.log("Server running")
})