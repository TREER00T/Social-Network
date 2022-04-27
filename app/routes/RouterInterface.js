let express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    Validation = require('app/util/Validation'),
    Pipeline = require('app/routes/Pipeline'),
    Json = require('app/util/ReturnJson'),
    Response = require('app/util/Response');


module.exports = {

    initialization() {

        dotenv.config();

        app.use(express.json(), bodyParser.urlencoded({extended: true}), bodyParser.json(), router);

        router.use((req, res, next) => {

            Json.initializationRes(res);

            Validation.isValidHttpMethod(req.method);

            let isSetUserToken = Pipeline.isSetUserToken(req.headers['authorization']);
            let isSetUserApiKey = Pipeline.isSetUserApiKey(req.body.apiKey);

            if (!isSetUserApiKey && !isSetUserToken)
                return Json.builder(Response.HTTP_TOKEN_OR_API_KEY_WAS_NOT_FOUND);


            next();
        });

        app.use('/auth', require('app/routes/AuthRoutes'));

        app.listen(process.env.PORT, () => {
            console.log('Server are running...');
        });

    }

}
