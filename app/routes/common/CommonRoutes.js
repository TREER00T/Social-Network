let router = require('express').Router(),
    Common = require('../../controller/common/CommonController');



router.get('/search', Common.search);



module.exports = router;