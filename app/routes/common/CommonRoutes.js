let express = require('express'),
    router = express.Router(),
    Common = require('app/controller/common/CommonController');



router.get('/search', Common.search);



module.exports = router;