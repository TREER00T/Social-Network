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

        return data?._id?.toString();

    },

    async isPublicKeyUsed(publicLink: string) {

        let data = await channel().findOne({
            publicLink: publicLink
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async links(channelId: string) {

        return await channel().find({
            _id: channelId
        }, {
            _id: 0,
            publicLink: 1,
            inviteLink: 1
        });

    },

    async isOwner(adminId: string, channelId: string) {

        let data = await channelAdmin().findOne({
            adminId: adminId,
            channelId: channelId,
            isOwner: 1
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async isOwnerOrAdmin(adminId: string, channelId: string) {

        let data = await channelAdmin().findOne({
            adminId: adminId,
            channelId: channelId
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async isJoined(channelId: string, userId: string) {

        let data = await channelUser().findOne({
            userId: userId,
            channelId: channelId
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async isAdmin(channelId: string, userId: string) {

        let data = await channelAdmin().findOne({
            adminId: userId,
            channelId: channelId
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async getInfo(channelId: string) {

        return await channel().findById(channelId);

    },


    async getCountOfUsers(channelId: string) {

        return await channel().find({_id: channelId}).countDocuments();

    },

    async getAllUsers(channelId: string) {

        return await channelUser().find({channelId: channelId}, {
            _id: 0,
            userId: 1
        });

    }

}