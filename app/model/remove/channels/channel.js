let openSql = require('opensql');


module.exports = {

    async channel(channelId) {
        await openSql.dropTable('`' + channelId + 'GroupContents`');
    },

    async admins(channelId) {
        await openSql.remove({
            table: 'channelsAdmins',
            where: {
                channelId: channelId
            }
        });
    },

    async users(channelId) {
        await openSql.remove({
            table: 'channelsUsers',
            where: {
                channelId: channelId
            }
        });
    },

    async userInChannel(channelId, userId) {
        await openSql.remove({
            table: 'channelsUsers',
            where: {
                channelId: channelId,
                userId: userId
            }
        });
    },

    async admin(channelId, userId) {
        await openSql.remove({
            table: 'channelsAdmins',
            where: {
                channelId: channelId,
                userId: userId
            }
        });
    }

}