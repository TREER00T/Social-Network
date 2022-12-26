let {
        groupUser,
        groupAdmin
    } = require('../../create/group'),
    {dropCollection} = require('../../../database/mongoDbDriverConnection');

module.exports = {

    async group(groupId) {

        await dropCollection(`${groupId}GroupContents`);

    },

    async admins(groupId) {

        await groupAdmin().deleteMany({
            groupId: groupId
        });

    },

    async users(groupId) {

        await groupUser().deleteMany({
            groupId: groupId
        });

    },

    async user(groupId, userId) {

        await groupUser().deleteOne({
            groupId: groupId,
            userId: userId
        });

    },

    async admin(groupId, userId) {

        await groupAdmin().deleteOne({
            groupId: groupId,
            userId: userId
        });

    }

}