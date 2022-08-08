let express = require('express'),
    router = express.Router(),
    Group = require('app/controller/group/GroupInterface');


router.post('/create', Group.create);
router.post('/uploadFile', Group.uploadFile);
router.delete('/:id', Group.deleteGroup);
router.put('/name', Group.changeName);
router.put('/description', Group.changeDescription);
router.put('/uploadAvatar', Group.uploadAvatar);
router.put('/inviteLink', Group.changeToInviteLink);
router.put('/publicLink', Group.changeToPublicLink);
router.post('/joinUser', Group.joinUser);
router.post('/addAdmin', Group.addAdmin);
router.delete('/deleteAdmin', Group.deleteAdmin);
router.delete('/leaveUser', Group.leaveUser);
router.get('/chats', Group.listOfMessage);
router.get('/info', Group.info);
router.get('/users', Group.allUsers);


module.exports = router;