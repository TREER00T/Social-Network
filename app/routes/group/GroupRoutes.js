let express = require('express'),
    router = express.Router(),
    Group = require('app/controller/group/GroupInterface');


router.post('/create', Group.create);
router.delete('/:id', Group.deleteGroup);
router.put('/name', Group.changeName);
router.put('/description', Group.changeDescription);
router.put('/uploadAvatar', Group.uploadAvatar);
router.put('/inviteLink', Group.changeToInviteLink);
router.put('/publicLink', Group.changeToPublicLink);


module.exports = router;