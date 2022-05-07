let openSql = require('app/database/OpenSql'),
    {
        CASCADE
    } = require('app/database/util/SqlKeyword');


module.exports = {


    groupContents(groupId) {
        openSql.addForeignKey({
            table: '`' + groupId + 'GroupContents`',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    groupsAdmins() {
        openSql.addForeignKey({
            table: 'groupsAdmins',
            foreignKey: 'adminId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: 'groupsAdmins',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    groupsUsers() {
        openSql.addForeignKey({
            table: 'groupsUsers',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: 'groupsUsers',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    reportGroups() {
        openSql.addForeignKey({
            table: 'reportGroups',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: 'reportGroups',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    }


}