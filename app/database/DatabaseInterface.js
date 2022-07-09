let create = require('app/model/create/CreateTableInterface'),
    add = require('app/model/add/foreignKey/AddForiegnKeyInterface'),
    Database = require('app/database/DatabaseConnection'),
    openSql = require('opensql'),
    dotenv = require('dotenv');

dotenv.config();

module.exports = {

    initialization() {
        Database.connect();
        openSql.createDatabase(process.env.DATABASE);
    },

    create() {
        create.tables();
        add.foreignKeys();
        return true;
    }

}