let openSql = require('opensql'),
    {
        CASCADE
    } = openSql.keywordHelper;


module.exports = {


    groupContents(groupId) {
        openSql.addForeignKey({
            table: groupId + 'GroupContents',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: groupId + 'GroupContents',
            foreignKey: 'senderId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    },

    groupsAdmins() {
        openSql.addForeignKey({
            table: 'groupsAdmins',
            foreignKey: 'adminId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: 'groupsAdmins',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    },


    groupsUsers() {
        openSql.addForeignKey({
            table: 'groupsUsers',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: 'groupsUsers',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    },


    reportGroups() {
        openSql.addForeignKey({
            table: 'reportGroups',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: 'reportGroups',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    }


}