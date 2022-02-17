const express = require('express'),
    router = express.Router(),
    User = require('../controller/User');


router.post('/gvc', User.generateVerificationCodeAndGetPhoneNumber);
router.post('/verify', User.checkVerificationCodeInDatabaseAndSingUpOrLogin);
router.get('/test', User.test);


module.exports = router;
