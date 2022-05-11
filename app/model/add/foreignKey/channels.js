let openSql = require('app/database/OpenSql'),
    {
        CASCADE
    } = require('app/database/util/SqlKeyword');

module.exports = {

    channelsAdmins() {

        openSql.addForeignKey({
            table: `channelsAdmins`,
            foreignKey: 'adminId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: `channelsAdmins`,
            foreignKey: 'channelId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });

    },


    channelsUsers() {
        openSql.addForeignKey({
            table: `channelsUsers`,
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: `channelsUsers`,
            foreignKey: 'channelId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    channelContents(channelId) {
        openSql.addForeignKey({
            table: '`' + channelId + 'ChannelContents`',
            foreignKey: 'forwardDataId',
            referenceTable: 'forwardContents',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: '`' + channelId + 'ChannelContents',
            foreignKey: 'senderId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    },


    reportChannels() {
        openSql.addForeignKey({
            table: 'reportChannels',
            foreignKey: 'userId',
            referenceTable: 'users',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
        openSql.addForeignKey({
            table: 'reportChannels',
            foreignKey: 'channelId',
            referenceTable: 'channels',
            field: 'id',
            onDelete: CASCADE,
            onUpdate: CASCADE
        });
    }


}