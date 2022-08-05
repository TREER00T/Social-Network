let express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    cors = require('cors'),
    Swagger = require('../../docs/swagger'),
    Validation = require('app/util/Validation'),
    Pipeline = require('app/middleware/ApiPipeline'),
    Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    authRouter = require('app/routes/user/AuthRoutes'),
    personalRouter = require('app/routes/user/PersonalRoutes'),
    groupRouter = require('app/routes/group/GroupRoutes'),
    channelRouter = require('app/routes/channel/ChannelRoutes'),
    commonRouter = require('app/routes/common/CommonRoutes'),
    e2eRouter = require('app/routes/user/PvChatRoutes');


module.exports = {

    initialization() {

        dotenv.config();

        app.use(express.json(), bodyParser.urlencoded({extended: true}), bodyParser.json(), express.raw(), cors());
        app.use((req, res, next) => {

            Json.initializationRes(res);


            if (!Validation.isValidHttpMethod(req.method))
                return Json.builder(Response.HTTP_METHOD_NOT_ALLOWED);


            let routeMsg = Validation.isRouteWithOutAuthentication(req.url, app).msg;

            if (routeMsg !== 'RouteForWithOutAuth' && routeMsg !== 'NotFound') {
                let token,
                    apiKey;
                try {
                    token = req?.headers?.authorization;
                    apiKey = (req?.headers?.apiKey !== undefined) ? req?.headers?.apiKey : req?.query?.apiKey;
                } catch (e) {
                }
                let isAccessTokenVerify = Pipeline.tokenVerify(token);


                let isSetUserToken = (!isAccessTokenVerify) ? isAccessTokenVerify : Pipeline.tokenVerify(token);
                let isSetUserApiKey = Pipeline.isSetUserApiKey(apiKey);

                if ((!isSetUserApiKey && !isSetUserToken) || !isSetUserToken)
                    return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_TOKEN);

                if (isSetUserApiKey && isSetUserToken) {
                    return Pipeline.getTokenPayLoad(data => {
                        Pipeline.isValidApiKey(apiKey, data.phoneNumber, result => {
                            if (!result) {
                                return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_API_KEY);
                            }
                            app.use(router);
                            next();
                        });
                    });
                }
            }

            app.use(router);
            next();
        });


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
    }

}
