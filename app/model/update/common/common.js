let openSql = require('opensql');


module.exports = {

    async message(tableName, data, id) {
        await openSql.update({
            table: tableName,
            edit: data,
            where: {
                id: id
            }
        });
    },

    async messageIdFromTableForwardContents(id, messageId) {
        await openSql.update({
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