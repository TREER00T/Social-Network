let {
    channel,
    channelUser,
    channelAdmin
} = require('../../create/channel');

export default {

    async id(id: string) {

        let data = await channel().findById(id, {
            _id: 1
        });

        return data?._id;

    },

    async isPublicKeyUsed(publicLink: string) {

        let data = await channel().findOne({
            publicLink: publicLink
        }, {
            _id: 1
        });

        return data?._id;

    },

    async isOwner(adminId: string, channelId: string) {

        let data = await channelAdmin().findOne({
            adminId: adminId,
            channelId: channelId,
            isOwner: 1
        }, {
            _id: 1
        });

        return data?._id;

    },

    async isOwnerOrAdmin(adminId: string, channelId: string) {

        let data = await channelAdmin().findOne({
            adminId: adminId,
            channelId: channelId
        }, {
            _id: 1
        });

        return data?._id;

    },

    async isJoined(channelId: string, userId: string) {

        let data = await channelUser().findOne({
            userId: userId,
            channelId: channelId
        }, {
            _id: 1
        });

        return data?._id;

    },

    async isAdmin(channelId: string, userId: string) {

        let data = await channelAdmin().findOne({
            userId: userId,
            channelId: channelId
        }, {
            _id: 1
        });

        return data?._id;

    },

    async getInfo(channelId: string) {

        return await channel().find({
            _id: channelId
        });

    },


    async getCountOfUsers(channelId: string) {

        return await channel().find({channelId: channelId}).countDocuments();

    },

    async getAllUsers(channelId: string) {

        return await channelUser().find({channelId: channelId}, {
            _id: 0,
            userId: 1
        });

    }

}