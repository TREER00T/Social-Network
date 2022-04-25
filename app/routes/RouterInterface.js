let express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    Validation = require('app/util/Validation'),
    {
        initializationRes
    } = require('app/util/ReturnJson');


module.exports = {

    initialization() {

        dotenv.config();

        app.use(express.json(), bodyParser.urlencoded({extended: true}), bodyParser.json(), router);

        router.use((req, res, next) => {
            initializationRes(res);
            try {
                Validation.checkHttpMethod(req.method);
                next();
            } catch (e) {
                throw new Error('Can not validate method');
            }
        });

        app.use('/auth', require('app/routes/AuthRoutes'));

        app.listen(process.env.PORT, () => {
            console.log('Server are running...');
        });

    }

}