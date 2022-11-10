let router = require('express').Router(),
    Personal = require('../../controller/user/personal/PersonalController');


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
router.delete('/account', Personal.account);
router.post('/message', Personal.addMessage);
router.post('/uploadFile', Personal.uploadFile);
router.delete('/message', Personal.deleteMessage);
router.put('/message', Personal.editMessage);


module.exports = router;