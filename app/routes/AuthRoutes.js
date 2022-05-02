const express = require('express'),
    router = express.Router(),
    User = require('app/controller/user/auth/GvcInterface');


router.post('/generate/user', User.gvc);
router.post('/refresh/token', User.refreshToken);
router.post('/verify/authCode', User.isValidAuthCode);
router.post('/verify/twoStep', User.isValidPassWord);


module.exports = router;
