let router = require('express').Router(),
    User = require('app/controller/user/auth/AuthController');


router.post('/generate/user', User.gvc);
router.post('/refresh/token', User.refreshToken);
router.post('/verify/authCode', User.isValidAuthCode);
router.post('/verify/twoStep', User.isValidPassword);


module.exports = router;