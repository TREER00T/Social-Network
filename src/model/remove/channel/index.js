let {
        channelUser,
        channelAdmin
    } = require('../../create/channel'),
    {dropCollection} = require('../../../database/mongoDbDriverConnection'),
    {channel} = require("../../create/channel");


module.exports = {

    async channelContent(channelId) {

        await dropCollection(`${channelId}ChannelContents`);

    },

    async channel(channelId) {

        await channel().deleteOne({
            _id: channelId
        });

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