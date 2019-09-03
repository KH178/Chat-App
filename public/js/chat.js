const socket = io();
const increment = document.querySelector('.increment');
const msgFormInput = document.querySelector('input');
const sendBtn = document.querySelector('button[type="submit"]');
const sendLoc = document.querySelector('button[type="button"]');
const chatSidebar = document.querySelector('.chat__sidebar');
msgFormInput.focus();

const messages = document.querySelector('#message');
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationTemplate = document.getElementById('location-template').innerHTML;
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

const autoScroll = ()=>{
    const newMessage = messages.lastElementChild;

    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin =parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = messages.offsetHeight;

    const containerHeight = messages.scrollHeight;

    const scrollOffset = messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight;
    }

   

    
}


//Options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true});
console.log(room);


socket.on('msg',(msg)=>{
    //  document.querySelector('h1').innerHTML = `${msg} to the Chat app!`;
    console.log(msg);
    const html = Mustache.render(messageTemplate, {
        msg : msg.txt,
        createdAt : moment(msg.createdAt).format("h:mm a"),
        username: msg.username
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoScroll();
})



document.querySelector('.formMsg').addEventListener('submit',(e)=>{
    event.preventDefault();
    console.log('Clicked');
    sendBtn.setAttribute("disabled", true);
    
    const message = e.target.elements.message.value;
     socket.emit('userMsg',message,(err)=>{
        msgFormInput.value = '';
        msgFormInput.focus();
        
         if(err){
           return console.log(err);
         }
         sendBtn.removeAttribute("disabled");
          console.log('Message Delivered');  
     })
    

    //  document.querySelector('.formMsg').reset();
})
const sendLocation = ()=>{
    if (!navigator.geolocation) {
        alert('Browser not supported!') 
      } 
      sendLoc.setAttribute("disabled", true);
      navigator.geolocation.getCurrentPosition((position)=>{
       const coord = {
           longi: position.coords.longitude,
           lati: position.coords.latitude   
       }
       socket.emit('sendLocation',coord,(res)=>{
               console.log(res);
       });
      }) 
      sendLoc.removeAttribute("disabled");
      msgFormInput.focus();
}
socket.on('location',(location)=>{
    console.log(location);
    const html = Mustache.render(locationTemplate, {
        loc : location.url,
        createdAt : moment(location.createdAt).format("h:mm a"),
        username: location.username
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoScroll();
})
socket.on('roomData',({room,users})=>{
    console.log(room,users);
    const html = Mustache.render(sidebarTemplate,{
        room,
        users,
    })
    
    chatSidebar.innerHTML = html;
})

document.querySelector('.locationSend').addEventListener('click',sendLocation);

socket.emit('join',{username,room},(err)=>{
    if(err){
        alert(err);
        location.href = '/';
    }
})
