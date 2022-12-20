let {forwardContent} = require('../../create/common'),
    {updateOne} = require('../../../database/mongoDbDriverConnection');


module.exports = {

    async message(tableName, data, id) {

       await updateOne(data, {_id: id}, tableName);

    },

    async messageIdFromTableForwardContents(id, messageId) {

        await forwardContent().findByIdAndUpdate(id,  {messageId: messageId});

    }

}