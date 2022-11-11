let openSql = require('opensql'),
    {
        CASCADE
    } = openSql.keywordHelper;


module.exports = {


    async groupContents(groupId) {
        await openSql.addForeignKey({
            table: groupId + 'GroupContents',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: groupId + 'GroupContents',
            foreignKey: 'senderId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },

    async groupsAdmins() {
        await openSql.addForeignKey({
            table: 'groupsAdmins',
            foreignKey: 'adminId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: 'groupsAdmins',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    async groupsUsers() {
        await openSql.addForeignKey({
            table: 'groupsUsers',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: 'groupsUsers',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    }


}