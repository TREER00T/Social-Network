let {createUsersTable} = require('../model/DatabaseOpenHelper');

module.exports = {
    createDatabase: () => {
        createUsersTable();
    }
}