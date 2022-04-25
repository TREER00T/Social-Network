let create = require('app/model/create/CreateTableInterface'),
    add = require('app/model/add/foreignKey/AddForiegnKeyInterface'),
    openSql = require('app/database/OpenSql');

module.exports = {

    initialization() {
        openSql.createDatabase();
        create.tables();
        add.foreignKeys();
    }

}