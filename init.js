let express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    Database = require('./app/model/DatabaseHelper'),
    Validation = require('./app/Util/Validation'),
    {initialization} = require("./app/Util/ReturnJson");


dotenv.config();

Database.createUsersTable();

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

app.use('/auth', require('./app/routes/AuthRoutes'));

app.listen(process.env.PORT, () => {
    console.log('Server are running...');
});

module.exports = {app, Database};