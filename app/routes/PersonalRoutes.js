let express = require('express'),
    router = express.Router(),
    Personal = require('app/controller/user/personal/PersonalInterface');


router.get('/user', Personal.user);
router.put('/username/:id', Personal.editUsername);
router.put('/bio/:bio', Personal.editBio);
router.put('/name', Personal.editName);


module.exports = router;