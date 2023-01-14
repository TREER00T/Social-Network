let {
    group,
    groupUser,
    groupAdmin
} = require('../../create/group');
import {HasOwner} from "../../../util/Types";

export default {

    async group(name: string, inviteLink: string, defaultColor: string, img: string) {

        let resultObject = img ? {img: img} : {};

        let data = await group()({
            ...resultObject,
            name: name,
            inviteLink: inviteLink,
            defaultColor: defaultColor
        }).save();

        return `${data._id}`;

    },

    async admin(userId: string, groupId: string, isOwner: HasOwner) {

        await groupAdmin()({
            adminId: userId,
            groupId: groupId,
            isOwner: isOwner
        }).save();

    },

    async user(userId: string, groupId: string) {

        await groupUser()({
            userId: userId,
            groupId: groupId
        }).save();

    }

}