let express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    Validation = require('../Util/Validation'),
    {initialization} = require('../Util/ReturnJson');


module.exports = {
    Router: () => {

        dotenv.config();

        app.use(express.json(), bodyParser.urlencoded({extended: true}), bodyParser.json(), router);

        router.use((req, res, next) => {
            initialization(res);
            try {
                Validation.checkHttpMethod(req.method);
                next();
            } catch (e) {
                throw new Error('Can not validate method');
            }
        });

        app.use('/auth', require('../routes/AuthRoutes'));

        app.listen(process.env.PORT, () => {
            console.log('Server are running...');
        });


    }
}