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
    }

}