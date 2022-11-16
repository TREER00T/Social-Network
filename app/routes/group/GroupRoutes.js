let router = require('express').Router(),
    Group = require('../../controller/group/GroupController');

let group = new Group();

router.post('/create', group.create);
router.post('/uploadFile', group.uploadFile);
router.delete('/:id', group.deleteGroup);
router.put('/name', group.changeName);
router.put('/description', group.changeDescription);
router.put('/uploadAvatar', group.uploadAvatar);
router.put('/inviteLink', group.changeToInviteLink);
router.put('/publicLink', group.changeToPublicLink);
router.post('/joinUser', group.joinUser);
router.post('/addAdmin', group.addAdmin);
router.delete('/deleteAdmin', group.deleteAdmin);
router.delete('/leaveUser', group.leaveUser);
router.get('/chats', group.listOfMessage);
router.get('/info', group.info);
router.get('/users', group.allUsers);


module.exports = router;