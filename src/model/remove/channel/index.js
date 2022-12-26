let {
        channelUser,
        channelAdmin
    } = require('../../create/channel'),
    {dropCollection} = require('../../../database/mongoDbDriverConnection');


module.exports = {

    async channel(channelId) {

        await dropCollection(`${channelId}ChannelContents`);

    },

    async admins(channelId) {

        await channelAdmin().deleteMany({
            channelId: channelId
        });

    },

    async users(channelId) {

        await channelUser().deleteMany({
            channelId: channelId
        });

    },

    async user(channelId, userId) {

        await channelUser().deleteOne({
            channelId: channelId,
            userId: userId
        });

    },

    async admin(channelId, userId) {

        await channelAdmin().deleteOne({
            channelId: channelId,
            userId: userId
        });

    }

}