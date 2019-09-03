const generateMessage = (username,txt)=>{
    return {
        username,
        txt,
        createdAt : new Date().getTime()
    }
}
const generateLocation= (username,coord)=>{
    return {
        username,
        url : `https://google.com/maps?q=${coord.lati},${coord.longi}`,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}