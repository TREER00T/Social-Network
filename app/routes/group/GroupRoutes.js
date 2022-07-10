let express = require('express'),
    router = express.Router(),
    Group = require('app/controller/group/GroupInterface');


router.post('/create', Group.create);
router.delete('/:id', Group.deleteGroup);
router.put('/uploadAvatar', Group.uploadAvatar);


module.exports = router;