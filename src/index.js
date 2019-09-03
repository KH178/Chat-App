const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const Filter = require('bad-words');
const {generateMessage, generateLocation} = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');

const port = process.env.PORT || 3000;

const publicDirPath = path.join(__dirname, '../public');
let userCount = 0;


// Setup static directory to serve.
app.use(express.static(publicDirPath)) // serves css , js


io.on('connection',(socket)=>{
    userCount++;
    socket.on('join',(options,callback)=>{ 
      const {error, user}=  addUser({id: socket.id, ...options});
      if(error){ 
          return callback(error);
      }
        socket.join(user.room)
        socket.emit('msg',generateMessage('Welcome!'));
        socket.broadcast.to(user.room).emit('msg',generateMessage(`"${user.username}" has joined!`));
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback();
       
    })
    socket.on('userMsg',(msg,callback)=>{
        const user = getUser(socket.id);
        if(user){
            const filter = new Filter();
            if(filter.isProfane(msg)){
              return  callback('Profanity is not allowed!');
            }
            io.to(user.room).emit('msg',generateMessage(user.username,msg));
            callback()
        }
        
    })
    socket.on('sendLocation',(coord,callback)=>{
        const user = getUser(socket.id)
        if(user){
            io.to(user.room).emit('location',generateLocation(user.username,coord))
            callback('Location Shared');
        }
        
    })
    socket.on('disconnect',()=>{
        userCount--;
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
         return io.to(user.room).emit('msg',generateMessage(`${user.username} has left!`))
        } 
    })  
})


app.get('',(req,res)=>{
    res.render('index');
})

server.listen(port,()=>{
    console.log(`Server is running in port ${port}`);
    
})