let {
        isUndefined
    } = require('../../../util/Util'),
    {
        channel,
        channelUser,
        channelAdmin
    } = require('../../create/channel'),
    {
        countRows
    } = require('../../../database/mongoDbDriverConnection');


module.exports = {

    async id(id) {

        let data = await channel().findById(id, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async isPublicKeyUsed(publicLink) {

        let data = await channel().findOne({
            publicLink: publicLink
        }, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async isOwner(adminId, channelId) {

        let data = await channelAdmin().findOne({
            adminId: adminId,
            channelId: channelId,
            isOwner: 1
        }, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async isOwnerOrAdmin(adminId, channelId) {

        let data = await channelAdmin().findOne({
            adminId: adminId,
            channelId: channelId
        }, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async isJoined(channelId, userId) {

        let data = await channelUser().findOne({
            userId: userId,
            channelId: channelId
        }, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async isAdmin(channelId, userId) {

        let data = await channelAdmin().findOne({
            userId: userId,
            channelId: channelId
        }, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async getCountOfListMessage(channelId) {

        return await countRows(`${channelId}ChannelContents`);

    },


    async getInfo(channelId) {

        let data = await channel().find({
            _id: channelId
        });

        return data;

    },


    async getCountOfUsers(channelId) {

        let count = await channel().find({channelId: channelId}).countDocuments();

        return count;

    },

    async getAllUsers(channelId) {

        let data = await channelUser().find({channelId: channelId}, {
            projection: {
                _id: 0,
                userId: 1
            }
        });

        return data;

    }

}