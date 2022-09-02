let router = require('express').Router(),
    Channel = require('app/controller/channel/ChannelInterface');


router.post('/create', Channel.create);
router.delete('/:id', Channel.deleteChannel);
router.post('/uploadFile', Channel.uploadFile);
router.put('/name', Channel.changeName);
router.put('/description', Channel.changeDescription);
router.put('/uploadAvatar', Channel.uploadAvatar);
router.put('/inviteLink', Channel.changeToInviteLink);
router.put('/publicLink', Channel.changeToPublicLink);
router.post('/joinUser', Channel.joinUser);
router.post('/addAdmin', Channel.addAdmin);
router.delete('/deleteAdmin', Channel.deleteAdmin);
router.delete('/leaveUser', Channel.leaveUser);
router.get('/chats', Channel.listOfMessage);
router.get('/info', Channel.info);
router.get('/users', Channel.allUsers);



module.exports = router;