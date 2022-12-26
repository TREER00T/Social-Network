let {
        channel,
        channelUser,
        channelAdmin
    } = require('../../create/channel'),
    {
        isUndefined
    } = require('../../../util/Util');


module.exports = {

    async channel(name, inviteLink, defaultColor, img) {

        let resultObject = !isUndefined(img) ? {img: img} : {};

        let data = await channel()({
            ...resultObject,
            name: name,
            inviteLink: inviteLink,
            defaultColor: defaultColor
        }).save();

        return `${data._id}`;

    },

    async admin(userId, channelId, isOwner) {

        await channelAdmin()({
            adminId: userId,
            channelId: channelId,
            isOwner: isOwner
        }).save();

    },

    async user(userId, channelId) {

        await channelUser()({
            userId: userId,
            channelId: channelId
        }).save();

    }

}