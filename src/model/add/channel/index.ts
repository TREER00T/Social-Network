let {
    channel,
    channelUser,
    channelAdmin
} = require('../../create/channel');
import Util from '../../../util/Util';
import {HasOwner} from "../../../util/Types";

export default {

    async channel(name: string, inviteLink: string, defaultColor: string, img: string) {

        let resultObject = !Util.isUndefined(img) ? {img: img} : {};

        let data = await channel()({
            ...resultObject,
            name: name,
            inviteLink: inviteLink,
            defaultColor: defaultColor
        }).save();

        return `${data._id}`;

    },

    async admin(userId: string, channelId: string, isOwner: HasOwner) {

        await channelAdmin()({
            adminId: userId,
            channelId: channelId,
            isOwner: isOwner
        }).save();

    },

    async user(userId: string, channelId: string) {

        await channelUser()({
            userId: userId,
            channelId: channelId
        }).save();

    }

}