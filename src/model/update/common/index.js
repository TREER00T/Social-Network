let {updateOne} = require('../../../database/mongoDbDriverConnection');


module.exports = {

    async message(tableName, data, id) {

       await updateOne(data, {_id: id}, tableName);

    }

}