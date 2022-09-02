let router = require('express').Router(),
    PvChat = require('app/controller/user/e2e/PvChatIntrface');


router.post('/room/create', PvChat.createE2EChat);
router.post('/room/uploadFile', PvChat.uploadFile);
router.post('/room/user/block', PvChat.blockUser);
router.get('/room/chats', PvChat.listOfMessage);
router.get('/room/user', PvChat.user);
router.delete('/room/:id/me', PvChat.deleteForMe);
router.delete('/room/:id/us', PvChat.deleteForUs);


module.exports = router;