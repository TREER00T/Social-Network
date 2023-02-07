import {RoomId} from "../../../util/Types";

let {
    channel,
    channelUser,
    channelAdmin
} = require('../../create/channel');

export default {

    async id(id: string | RoomId) {

        if (typeof id === 'string') {

            let data = await channel().findById(id, {
                _id: 1
            });

            return data?._id?.toString();
        }

        let data = await channel().findOne({[id.type === 'channelId' ? '_id' : id.type]: id.id}, {
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

        return await channel().findById(channelId, {
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

    async getInfo(channelId: string, isOwnerOrAdmin?: boolean) {

        if (isOwnerOrAdmin)
            return await channel().findById(channelId);

        return await channel().findById(channelId, {
            _id: 1,
            img: 1,
            name: 1,
            inviteLink: 0,
            publicLink: 1,
            description: 1,
            defaultColor: 1
        });

    },

    async getCountOfUsers(channelId: string) {

        return await channel().findById(channelId).countDocuments();

    },

    async getAllUsers(channelId: string) {

        return await channelUser().find({
            channelId: channelId
        }, {
            _id: 0,
            userId: 1
        });

    }

}