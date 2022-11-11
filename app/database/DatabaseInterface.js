let Create = require('../model/create/CreateTableInterface'),
    Add = require('../model/add/foreignKey/AddForiegnKeyInterface'),
    Database = require('../database/DatabaseConnection'),
    openSql = require('opensql'),
    dotenv = require('dotenv');

dotenv.config();

module.exports = {

    async connect() {
        await Database.connect();
    },

    async createDatabase() {
        await openSql.createDatabase(process.env.DATABASE).then(async () => {
            await this.createTable();
        });
    },

    async createTable() {
        await Create.tables().then(async () => {
            await Add.foreignKeys();
        });
    }

}