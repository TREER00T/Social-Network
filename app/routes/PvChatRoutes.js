let express = require('express'),
    router = express.Router(),
    PvChat = require('app/controller/user/e2e/PvChatIntrface');



router.post('/room/create', PvChat.createChat);


module.exports = router;