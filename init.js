require('app-module-path').addPath(__dirname);
// require('app/io/Interface');
// let Router = require('app/middleware/RouterInterface');
//
//
// Router.initialization();
const {validateMessage} = require("app/io/util/util");


validateMessage({
    text: 'Hello',
    type: 'None',
    senderId :'0',
},result=>{
    console.log(result);
});