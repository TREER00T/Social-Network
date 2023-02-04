let {deleteMany} = require('../../../database/mongoDbDriverConnection');

export default {

    async message(tableName: string, listOfId: string[]) {

        await deleteMany({_id: {$in: listOfId}}, tableName);

    }

}