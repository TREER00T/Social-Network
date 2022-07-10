let express = require('express'),
    router = express.Router(),
    Group = require('app/controller/group/GroupInterface');


router.post('/create', Group.create);
router.delete('/:id', Group.deleteGroup);


module.exports = router;