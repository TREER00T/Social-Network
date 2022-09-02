let create = require('app/model/create/CreateTableInterface'),
    add = require('app/model/add/foreignKey/AddForiegnKeyInterface'),
    Database = require('app/database/DatabaseConnection'),
    openSql = require('opensql'),
    dotenv = require('dotenv');

dotenv.config();

module.exports = {

    initialization(cb) {
        Database.connect(cb);
        openSql.createDatabase(process.env.DATABASE);
    },

    create(cb) {
        create.tables();
        add.foreignKeys();
        cb();
    }

}