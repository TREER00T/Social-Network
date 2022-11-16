let router = require('express').Router(),
    Personal = require('../../../controller/user/personal');

let personal = new Personal();

router.get('/user', personal.user);
router.put('/username/:id', personal.editUsername);
router.put('/bio', personal.editBio);
router.put('/name', personal.editName);
router.put('/twoAuth', personal.twoAuth);
router.put('/twoAuth/disable', personal.disableTwoAuth);
router.put('/twoAuth/rest/password', personal.restPassword);
router.put('/uploadAvatar', personal.uploadAvatar);
router.get('/blockUsers', personal.listOfBlockUsers);
router.get('/devices', personal.listOfDevices);
router.get('/savedMessage', personal.listOfMessage);
router.delete('/savedMessage', personal.deleteSavedMessage);
router.post('/savedMessage', personal.createSavedMessage);
router.delete('/account', personal.account);
router.post('/message', personal.addMessage);
router.post('/uploadFile', personal.uploadFile);
router.delete('/message', personal.deleteMessage);
router.put('/message', personal.editMessage);


module.exports = router;