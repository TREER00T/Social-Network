let openSql = require('opensql'),
    {
        CASCADE
    } = openSql.keywordHelper;


module.exports = {


    async e2eContents(fromUser, toUser) {
        await openSql.addForeignKey({
            table: fromUser + 'And' + toUser + 'E2EContents',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: fromUser + 'And' + toUser + 'E2EContents',
            foreignKey: 'senderId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    async userBlockList() {
        await openSql.addForeignKey({
            table: 'userBlockList',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: 'userBlockList',
            foreignKey: 'userTargetId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },

    async devices() {
        await openSql.addForeignKey({
            table: 'devices',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },

    async savedMessages(phone) {
        await openSql.addForeignKey({
            table: phone + 'SavedMessages',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: phone + 'SavedMessages',
            foreignKey: 'senderId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    async listOfUserGroups() {
        await openSql.addForeignKey({
            table: 'listOfUserGroups',
            foreignKey: 'groupId',
            referenceTable: 'groups',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: 'listOfUserGroups',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    async listOfUserChannels() {
        await openSql.addForeignKey({
            table: 'listOfUserChannels',
            foreignKey: 'channelId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: 'listOfUserChannels',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    async listOfUserE2Es() {
        await openSql.addForeignKey({
            table: 'listOfUserE2Es',
            foreignKey: 'toUser',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: 'listOfUserE2Es',
            foreignKey: 'fromUser',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: 'listOfUserE2Es',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    }

}