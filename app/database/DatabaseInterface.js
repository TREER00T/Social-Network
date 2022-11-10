let Create = require('../model/create/CreateTableInterface'),
    Add = require('../model/add/foreignKey/AddForiegnKeyInterface'),
    Database = require('../database/DatabaseConnection'),
    openSql = require('opensql'),
    dotenv = require('dotenv');

dotenv.config();

module.exports = {

    initialization(cb) {
        Database.connect(cb);
        openSql.createDatabase(process.env.DATABASE);
    },

    create(cb) {
        Create.tables();
        Add.foreignKeys();
        cb();
    }

}