let express = require('express'),
    router = express.Router(),
    PvChat = require('app/controller/user/e2e/PvChatIntrface');



let multer  = require('multer'),
    upload = multer(),
    type = upload.single('png');


router.post('/room/create', PvChat.createE2EChat);
router.post('/room/uploadFile',type, PvChat.uploadFile);


module.exports = router;