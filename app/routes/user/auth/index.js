let router = require('express').Router(),
    User = require('../../../controller/user/auth');

let user = new User();

router.post('/generate/user', user.gvc);
router.post('/refresh/token', user.refreshToken);
router.post('/verify/authCode', user.isValidAuthCode);
router.post('/verify/twoStep', user.isValidPassword);


module.exports = router;