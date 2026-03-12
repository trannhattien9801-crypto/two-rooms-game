const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const path = require("path")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname,"public")))

let players = []

io.on("connection",(socket)=>{

// người chơi tham gia
socket.on("join",(name)=>{

players.push({
id:socket.id,
name:name
})

io.emit("players",players)

})

// host bắt đầu game
socket.on("startGame",(count)=>{

let roles=[]

// vai chính
roles.push("Tổng Thống")
roles.push("Kẻ Đặt Bom")

// vai đặc biệt
roles.push("Bác Sĩ")
roles.push("Kỹ Sư")
roles.push("Vệ Sĩ")
roles.push("Thám Tử")
roles.push("Phóng Viên")
roles.push("Luật Sư")
roles.push("Gián Điệp")
roles.push("Sát Thủ")
roles.push("Bắn Tỉa")
roles.push("Kẻ Lừa Đảo")
roles.push("Kẻ Phá Hoại")
roles.push("Con Bạc")
roles.push("Nhà Đàm Phán")
roles.push("Nhà Tiên Tri")
roles.push("Bản Sao")

// người câm
roles.push("Người Câm Xanh")
roles.push("Người Câm Đỏ")

// thêm dân thường
while(roles.length < count){

if(Math.random() > 0.5){
roles.push("Đội Xanh")
}else{
roles.push("Đội Đỏ")
}

}

// random vai
roles = roles.sort(()=>Math.random()-0.5)

// phát role cho player
players.forEach((p,i)=>{

p.role = roles[i]

io.to(p.id).emit("role",roles[i])

})

// gửi danh sách role cho host
io.emit("showRoles",players)

})

// người chơi rời game
socket.on("disconnect",()=>{

players = players.filter(p=>p.id !== socket.id)

io.emit("players",players)

})

})

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
console.log("Server running")
})