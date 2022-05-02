let express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    Validation = require('app/util/Validation'),
    Pipeline = require('app/routes/Pipeline'),
    Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response'),
    User = require("app/controller/user/auth/AuthInterface");


module.exports = {

    initialization() {

        dotenv.config();

        app.use(express.json(), bodyParser.urlencoded({extended: true}), bodyParser.json());

        app.use((req, res, next) => {

            Json.initializationRes(res);

            Validation.isValidHttpMethod(req.method);


            let isSetUserAccessToken = Pipeline.isSetUserAccessToken(req.headers['authorization']);
            let isSetUserRefreshToken = Pipeline.isSetUserRefreshToken(req.headers['authorization']);
            let isSetUserApiKey = Pipeline.isSetUserApiKey(req.body.apiKey);
            let isSetPhone = (req.body.phone !== undefined) ? true : false;



            if (!isSetUserApiKey && !isSetUserAccessToken && !isSetPhone && !isSetUserRefreshToken ||
                isSetUserApiKey && !isSetUserAccessToken && isSetPhone ||
                !isSetUserApiKey && isSetUserAccessToken && isSetPhone)
                return Json.builder(Response.HTTP_TOKEN_OR_API_KEY_WAS_NOT_FOUND);


            app.use(router);
            next();
        });


        app.use('/auth', require('app/routes/AuthRoutes'));

        app.listen(process.env.PORT, () => {
            console.log('Server are running...');
        });

    }

}
