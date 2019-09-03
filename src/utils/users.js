const users = [];

const addUser = ({id,username,room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase();

    if(!username || !room){
        return{
            error : 'username and room is required!'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser){
        return { error : 'Username is already taken!'};
    }

    const user = {id, username, room};
    users.push(user);
    return {user};
    
}


const removeUser = (id)=>{
    const index = users.findIndex(user=>{
        return user.id === id;
    })

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{
    const index = users.findIndex(user =>{
        return user.id === id;
    })

    if(index !== -1){
        return users[index];
    }
}

const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase();
   const usersInRoom = users.filter(user=>{
       return user.room === room
   })
   if(usersInRoom.length === 0){
       return 'No user present!'
   }
   return usersInRoom;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
    
}