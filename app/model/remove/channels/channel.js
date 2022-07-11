let openSql = require('opensql');


module.exports = {

    channel(channelId) {
        openSql.dropTable('`' + channelId + 'GroupContents`');
    },

    channelAdmins(channelId) {
        openSql.remove({
            table: 'channelsAdmins',
            where: {
                channelId: channelId
            }
        });
    },

    channelUsers(channelId) {
        openSql.remove({
            table: 'channelsUsers',
            where: {
                channelId: channelId
            }
        });
    },

    userIntoChannel(channelId, userId) {
        openSql.remove({
            table: 'channelsUsers',
            where: {
                channelId: channelId,
                userId: userId
            }
        });
    },

    userIntoChannelAdmins(channelId, userId) {
        openSql.remove({
            table: 'channelsAdmins',
            where: {
                channelId: channelId,
                userId: userId
            }
        });
    }

}