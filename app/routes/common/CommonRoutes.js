let router = require('express').Router(),
    Common = require('../../controller/common/CommonController');

let common = new Common();

router.get('/search', common.search);



module.exports = router;