let express = require('express'),
    router = express.Router(),
    Group = require('app/controller/group/GroupInterface');


router.post('/create', Group.create);


module.exports = router;