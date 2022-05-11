let openSql = require('app/database/OpenSql'),
    {
        CASCADE
    } = require('app/database/util/SqlKeyword');

module.exports = {


    e2eContents(e2eId) {
        openSql.addForeignKey({
            table: '`' + e2eId + 'E2EContents',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: '`' + e2eId + 'E2EContents',
            foreignKey: 'senderId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    userBlockList() {
        openSql.addForeignKey({
            table: `userBlockList`,
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: `userBlockList`,
            foreignKey: 'userTargetId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    devices() {
        openSql.addForeignKey({
            table: `devices`,
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    savedMessages(phone) {
        openSql.addForeignKey({
            table: '`' + phone + 'SavedMessages`',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: '`' + phone + 'SavedMessages',
            foreignKey: 'senderId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    listOfUserGroups() {
        openSql.addForeignKey({
            table: 'listOfUserGroups',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: 'listOfUserGroups',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    listOfUserChannels() {
        openSql.addForeignKey({
            table: 'listOfUserChannels',
            foreignKey: 'channelId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: 'listOfUserChannels',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    listOfUserE2Es() {
        openSql.addForeignKey({
            table: 'listOfUserE2Es',
            foreignKey: 'toUser',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: 'listOfUserE2Es',
            foreignKey: 'fromUser',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    }

}