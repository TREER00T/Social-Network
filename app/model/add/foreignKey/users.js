let openSql = require('app/database/OpenSql'),
    {
        CASCADE
    } = require('app/database/util/KeywordHelper');

module.exports = {


    e2eContents(fromUser, toUser) {
        openSql.addForeignKey({
            table: fromUser + 'And' + toUser + 'E2EContents',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: fromUser + 'And' + toUser + 'E2EContents',
            foreignKey: 'senderId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    },


    userBlockList() {
        openSql.addForeignKey({
            table: 'userBlockList',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: 'userBlockList',
            foreignKey: 'userTargetId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    },


    devices() {
        openSql.addForeignKey({
            table: 'devices',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    },


    savedMessages(phone) {
        openSql.addForeignKey({
            table: phone + 'SavedMessages',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: phone + 'SavedMessages',
            foreignKey: 'senderId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    },


    listOfUserGroups() {
        openSql.addForeignKey({
            table: 'listOfUserGroups',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: 'listOfUserGroups',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    },


    listOfUserChannels() {
        openSql.addForeignKey({
            table: 'listOfUserChannels',
            foreignKey: 'channelId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: 'listOfUserChannels',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    },


    listOfUserE2Es() {
        openSql.addForeignKey({
            table: 'listOfUserE2Es',
            foreignKey: 'toUser',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
        openSql.addForeignKey({
            table: 'listOfUserE2Es',
            foreignKey: 'fromUser',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        }).result(()=>{});
    }

}