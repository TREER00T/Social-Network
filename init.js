let initializationDatabase = require('./app/database/InitDatabase'),
    initializationRouter = require('./app/routes/InitRouter'),
    db = require('./app/database/OpenSql');


initializationRouter.Router();

// initializationDatabase.Database();
