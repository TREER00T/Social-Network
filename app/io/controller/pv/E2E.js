let Server = require('app/io/connect/connection');

Server.io.on('connection',(socket)=>{
    console.log(socket.id);
});