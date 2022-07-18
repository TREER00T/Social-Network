let openSql = require('opensql');


module.exports = {

    message(tableName, data, id) {
        openSql.update({
            table: tableName,
            edit: data,
            where: {
                id: id
            }
        });
    },

    messageIdFromTableForwardContents(id, messageId) {
        openSql.update({
            table: 'forwardContents',
            edit: {
                messageId: messageId
            },
            where: {
                id: id
            }
        });
    }

}