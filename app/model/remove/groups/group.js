let openSql = require('opensql');


module.exports = {

    async group(groupId) {
        await openSql.dropTable('`' + groupId + 'GroupContents`');
    },

    async groupAdmins(groupId) {
        await openSql.remove({
            table: 'groupsAdmins',
            where: {
                groupId: groupId
            }
        });
    },

    async groupUsers(groupId) {
        await openSql.remove({
            table: 'groupsUsers',
            where: {
                groupId: groupId
            }
        });
    },

    async user(groupId, userId) {
        await openSql.remove({
            table: 'groupsUsers',
            where: {
                groupId: groupId,
                userId: userId
            }
        });
    },

    async admin(groupId, userId) {
        await openSql.remove({
            table: 'groupsAdmins',
            where: {
                groupId: groupId,
                userId: userId
            }
        });
    }

}