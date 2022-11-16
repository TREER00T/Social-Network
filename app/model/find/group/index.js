let {
        isUndefined
    } = require('../../../util/Util'),
    {
        group,
        groupUser,
        groupAdmin
    } = require('../../create/group'),
    {
        findMany,
        countRows
    } = require('../../../database/mongoDbDriverConnection');


module.exports = {

    async id(id) {

        let data = await group().findById(id, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async isPublicKeyUsed(publicLink) {

        let data = await group().find({
            publicLink: publicLink
        }, {
            projection: {
                _id: 0,
                publicLink: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async isOwner(adminId, groupId) {

        let data = await groupAdmin().findOne({
            adminId: adminId,
            groupId: groupId,
            isOwner: 1
        }, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async isJoined(groupId, userId) {

        let data = await groupUser().findOne({
            groupId: groupId,
            userId: userId
        }, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async isAdmin(groupId, userId) {

        let data = await groupAdmin().findOne({
            userId: userId,
            groupId: groupId
        }, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(data?._id);

    },

    async getCountOfListMessage(groupId) {

        return await countRows(`${groupId}GroupContents`);

    },


    async getInfo(groupId) {

        let data = await group().find({groupId: groupId});

        return data;

    },


    async getCountOfUsers(groupId) {

        let count = await group().find({groupId: groupId}).countDocuments();

        return count;

    },

    async getAllUsers(groupId) {

        let data = await groupUser().find({
            groupId: groupId
        }, {
            projection: {
                _id: 0,
                userId: 1
            }
        });

        return data;

    }

}