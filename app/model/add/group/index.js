let {
        group,
        groupUser,
        groupAdmin
    } = require('../../create/group'),
    {
        isUndefined
    } = require('../../../util/Util');


module.exports = {

    async group(name, inviteLink, defaultColor, img) {

        let resultObject = !isUndefined(img) ? {img: img} : {};

        let data = await group()({
            ...resultObject,
            name: name,
            inviteLink: inviteLink,
            defaultColor: defaultColor
        }).save();

        return `${data._id}`;

    },

    async admin(userId, groupId, isOwner) {

        await groupAdmin()({
            adminId: userId,
            groupId: groupId,
            isOwner: isOwner
        }).save();

    },

    async user(userId, groupId) {

        await groupUser()({
            userId: userId,
            groupId: groupId
        }).save();

    }

}