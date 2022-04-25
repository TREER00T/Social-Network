const express = require('express'),
    router = express.Router(),
    User = require('app/controller/user/auth/GvcInterface');


router.post('/gvc', User.gvc);
router.post('/verify', User.isValidAuthCode);


module.exports = router;
