let express = require('express'),
    router = express.Router(),
    Personal = require('app/controller/user/personal/PersonalInterface');


router.get('/user', Personal.user);
router.put('/username/:id', Personal.editUsername);
router.put('/bio/:bio', Personal.editBio);
router.put('/name', Personal.editName);
router.put('/twoAuth', Personal.twoAuth);
router.put('/twoAuth/disable', Personal.disableTwoAuth);
router.put('/twoAuth/rest/password', Personal.restPassword);
router.put('/uploadAvatar', Personal.uploadAvatar);
router.get('/blockUsers', Personal.listOfBlockUsers);
router.get('/devices', Personal.listOfDevices);
router.get('/savedMessage', Personal.listOfMessage);
router.delete('/savedMessage', Personal.deleteSavedMessage);
router.post('/savedMessage', Personal.createSavedMessage);


module.exports = router;