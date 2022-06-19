let express = require('express'),
    router = express.Router(),
    PvChat = require('app/controller/user/e2e/PvChatIntrface');


router.post('/room/create', PvChat.createE2EChat);
router.post('/room/uploadFile', PvChat.uploadFile);


module.exports = router;