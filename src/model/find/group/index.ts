let {
        group,
        groupUser,
        groupAdmin
    } = require('../../create/group'),
    {
        countRows
    } = require('../../../database/mongoDbDriverConnection');

export default {

    async id(id: string) {

        let data = await group().findById(id, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async isPublicKeyUsed(publicLink: string) {

        let data = await group().find({
            publicLink: publicLink
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async links(groupId: string) {

        return await group().find({
            _id: groupId
        }, {
            _id: 0,
            publicLink: 1,
            inviteLink: 1
        });

    },

    async isOwner(adminId: string, groupId: string) {

        let data = await groupAdmin().findOne({
            adminId: adminId,
            groupId: groupId,
            isOwner: 1
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async isJoined(groupId: string, userId: string) {

        let data = await groupUser().findOne({
            groupId: groupId,
            userId: userId
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async isAdmin(groupId: string, userId: string) {

        let data = await groupAdmin().findOne({
            adminId: userId,
            groupId: groupId
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async getCountOfListMessage(groupId: string) {

        return await countRows(`${groupId}GroupContents`);

    },


    async getInfo(groupId: string) {

        return await group().findById(groupId);

    },


    async getCountOfUsers(groupId: string) {

        return await group().find({_id: groupId}).countDocuments();

    },

    async getAllUsers(groupId: string) {

        return await groupUser().find({
            groupId: groupId
        }, {
            _id: 0,
            userId: 1
        });

    }

}