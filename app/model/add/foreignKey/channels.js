let openSql = require('opensql'),
    {
        CASCADE
    } = openSql.keywordHelper;

module.exports = {

    async channelsAdmins() {
        await openSql.addForeignKey({
            table: 'channelsAdmins',
            foreignKey: 'adminId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: 'channelsAdmins',
            foreignKey: 'channelId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    async channelsUsers() {
        await openSql.addForeignKey({
            table: 'channelsUsers',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: 'channelsUsers',
            foreignKey: 'channelId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    async channelContents(channelId) {
        await openSql.addForeignKey({
            table: channelId + 'ChannelContents',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

        await openSql.addForeignKey({
            table: channelId + 'ChannelContents',
            foreignKey: 'senderId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    }


}