let {
    channel,
    channelUser,
    channelAdmin
} = require('../../create/channel');
import Util from '../../../util/Util';


export default {

    async channel(name, inviteLink, defaultColor, img) {

        let resultObject = !Util.isUndefined(img) ? {img: img} : {};

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