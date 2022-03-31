let initializationDatabase = require('./app/database/InitDatabase'),
    initializationRouter = require('./app/routes/InitRouter'),
    db = require('./app/database/OpenSql'),
    {
        getOperatorAndValue
    } = require("./app/database/util/FieldUtilities");
const {EQUAL_TO} = require("./app/database/util/SqlKeyword");
const {update} = require("./app/database/OpenSql");
const {ali} = require("./app/model/DatabaseOpenHelper");


initializationRouter.Router();

// initializationDatabase.Database();

/*
db.update().result((result)=>{
    console.log(result)
});

 */

// query(`${USE_DATABASE} UPDATE ?? SET ?? = ?,??=? WHERE ?? = ? `, ['users','verificationCode','122875','username','ali','phoneNumber','09030207892'], getError());


update({
    table: 'users',
    editField: {
        verificationCode: 122875,
        username: 'ali'
    },
    where: {
        phoneNumber: getOperatorAndValue(EQUAL_TO, '09030207892')
    }
});