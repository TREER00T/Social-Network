let express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
    Database = require('./app/Util/DatabaseHelper'),
    Validation = require('./app/Util/Validation');


dotenv.config();

Database.createUsersTable();

app.use(bodyParser.urlencoded({ extended: true }),bodyParser.json(),router);

router.use((req,res,next)=>{
    try{
        Validation.httpMethod(res,req.method);
        next();
    }catch(e){
        throw new Error('Can not set header');
    }
});

app.use('/auth',require('./app/routes/AuthRoutes'));

app.listen(process.env.PORT,()=>{
    console.log('Server are running...');
});