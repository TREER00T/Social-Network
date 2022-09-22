let openSql = require('opensql');


module.exports = {

    channel(channelId) {
        openSql.dropTable('`' + channelId + 'GroupContents`');
    },

    admins(channelId) {
        openSql.remove({
            table: 'channelsAdmins',
            where: {
                channelId: channelId
            }
        });
    },

    users(channelId) {
        openSql.remove({
            table: 'channelsUsers',
            where: {
                channelId: channelId
            }
        });
    },

    userInChannel(channelId, userId) {
        openSql.remove({
            table: 'channelsUsers',
            where: {
                channelId: channelId,
                userId: userId
            }
        });
    },

    admin(channelId, userId) {
        openSql.remove({
            table: 'channelsAdmins',
            where: {
                channelId: channelId,
                userId: userId
            }
        });
    }

}