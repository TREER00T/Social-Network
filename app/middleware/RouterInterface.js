let express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    Validation = require('app/util/Validation'),
    Pipeline = require('app/middleware/ApiPipeline'),
    Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    authRouter = require('app/routes/user/AuthRoutes'),
    personalRouter = require('app/routes/user/PersonalRoutes'),
    groupRouter = require('app/routes/group/GroupRoutes'),
    e2eRouter = require('app/routes/user/PvChatRoutes');


module.exports = {

    initialization() {

        dotenv.config();

        app.use(express.json(), bodyParser.urlencoded({extended: true}), bodyParser.json());

        app.use((req, res, next) => {

            Json.initializationRes(res);

            Validation.isValidHttpMethod(req.method);


            let accessToken = req.headers['authorization-at'];
            let refreshToken = req.headers['authorization-rt'];
            let apiKey = (req.body.apiKey !== undefined) ? req.body.apiKey : req.query.apiKey;
            let phone = req.body.phone;


            let isSetUserAccessToken = Pipeline.accessTokenVerify(accessToken);
            let isSetUserRefreshToken = Pipeline.refreshTokenVerify(refreshToken);
            let isSetUserApiKey = Pipeline.isSetUserApiKey(apiKey);
            let isSetPhone = (req.body.phone !== undefined);


            if ((!isSetUserApiKey && !isSetUserAccessToken && !isSetPhone && !isSetUserRefreshToken) ||
                (isSetUserApiKey && !isSetUserAccessToken && !isSetPhone) ||
                (!isSetUserApiKey && isSetUserAccessToken && !isSetPhone))
                return Json.builder(Response.HTTP_TOKEN_OR_API_KEY_WAS_NOT_FOUND);


            if (isSetPhone && isSetUserApiKey && isSetUserAccessToken) {
                return Pipeline.isValidApiKey(apiKey, phone, result => {
                    if (!result) {
                        return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_API_KEY);
                    }
                    app.use(router);
                    next();
                });
            }

            app.use(router);
            next();
        });


        app.use('/auth', authRouter);
        app.use('/e2e', e2eRouter);
        app.use('/personal', personalRouter);
        app.use('/groups', groupRouter);

        app.listen(process.env.EXPRESS_PORT, () => {
            console.log('Server are running...');
        });

    }

}
