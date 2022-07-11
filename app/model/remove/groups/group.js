let openSql = require('opensql');


module.exports = {

    group(groupId) {
        openSql.dropTable('`' + groupId + 'GroupContents`');
    },

    groupAdmins(groupId) {
        openSql.remove({
            table: 'groupsAdmins',
            where: {
                groupId: groupId
            }
        });
    },

    groupUsers(groupId) {
        openSql.remove({
            table: 'groupsUsers',
            where: {
                groupId: groupId
            }
        });
    },

    userIntoGroup(groupId, userId) {
        openSql.remove({
            table: 'groupsUsers',
            where: {
                groupId: groupId,
                userId: userId
            }
        });
    },

    userIntoGroupAdmins(groupId, userId) {
        openSql.remove({
            table: 'groupsAdmins',
            where: {
                groupId: groupId,
                userId: userId
            }
        });
    }

}