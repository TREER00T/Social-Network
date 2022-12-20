let router = require('express').Router(),
    Channel = require('../../controller/channel');

let channel = new Channel();

router.post('/create', channel.create);
router.delete('/:id', channel.deleteChannel);
router.post('/uploadFile', channel.uploadFile);
router.put('/name', channel.changeName);
router.put('/description', channel.changeDescription);
router.put('/uploadAvatar', channel.uploadAvatar);
router.put('/inviteLink', channel.changeToInviteLink);
router.put('/publicLink', channel.changeToPublicLink);
router.post('/joinUser', channel.joinUser);
router.post('/addAdmin', channel.addAdmin);
router.delete('/deleteAdmin', channel.deleteAdmin);
router.delete('/leaveUser', channel.leaveUser);
router.get('/chats', channel.listOfMessage);
router.get('/info', channel.info);
router.get('/users', channel.allUsers);



module.exports = router;