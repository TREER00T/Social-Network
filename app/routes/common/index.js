let router = require('express').Router(),
    Common = require('../../controller/common');

let common = new Common();

router.get('/search', common.search);



module.exports = router;