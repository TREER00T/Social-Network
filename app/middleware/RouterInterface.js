let express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    cors = require('cors'),
    Swagger = require('../../docs/swagger'),
    Validation = require('../util/Validation'),
    RouterUtil = require('../middleware/RouterUtil'),
    Json = require('../util/ReturnJson'),
    Response = require('../util/Response'),
    authRouter = require('../routes/user/auth'),
    personalRouter = require('../routes/user/personal'),
    groupRouter = require('../routes/group'),
    channelRouter = require('../routes/channel'),
    commonRouter = require('../routes/common'),
    e2eRouter = require('../routes/user/e2e');


module.exports = {

    async initialization() {

        dotenv.config();

        app.use(express.json(), bodyParser.urlencoded({extended: true}), bodyParser.json(), express.raw(), cors());
        app.use(async (req, res, next) => {

            Json.initializationRes(res);


            if (!Validation.isValidHttpMethod(req.method))
                return Json.builder(Response.HTTP_METHOD_NOT_ALLOWED);


            let requestMessage = Validation.requestEndpointHandler(req.url, req.method.toLowerCase(), app);

            if (requestMessage === 'NotFound')
                return Json.builder(Response.HTTP_NOT_FOUND);

            if (requestMessage === 'AuthRoute') {
                let token,
                    apiKey;
                try {
                    token = req.headers?.authorization;
                    apiKey = req.headers?.apiKey ? req.headers?.apiKey : req.query?.apiKey;
                } catch (e) {
                }
                let isAccessTokenVerify = RouterUtil.tokenVerify(token);


                let isSetUserToken = !isAccessTokenVerify ? isAccessTokenVerify : await RouterUtil.tokenVerify(token);
                let isSetUserApiKey = RouterUtil.isSetUserApiKey(apiKey);

                if (!isSetUserApiKey || !isSetUserToken)
                    return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_TOKEN);

                let data = await RouterUtil.getTokenPayLoad();
                let result = await RouterUtil.isValidApiKey(apiKey, data.phoneNumber);

                if (!result)
                    return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_API_KEY);

                next();
            }


            next();
        });


        app.use(router);
        app.use('/api/auth', authRouter);
        app.use('/api/e2e', e2eRouter);
        app.use('/api/personal', personalRouter);
        app.use('/api/group', groupRouter);
        app.use('/api/channel', channelRouter);
        app.use('/api/common', commonRouter);


        app.listen(process.env.EXPRESS_PORT, () => {
            console.log('Server are running...');
        });

        Swagger.restApi(app);
        Swagger.socketIo();
    }

}
