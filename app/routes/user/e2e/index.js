let router = require('express').Router(),
    PvChat = require('../../../controller/user/e2e');

let pvChat = new PvChat();

router.post('/room/create', pvChat.createE2EChat);
router.post('/room/uploadFile', pvChat.uploadFile);
router.post('/room/user/block', pvChat.blockUser);
router.get('/room/chats', pvChat.listOfMessage);
router.get('/room/user', pvChat.user);
router.delete('/room/:id/me', pvChat.deleteForMe);
router.delete('/room/:id/us', pvChat.deleteForUs);


module.exports = router;