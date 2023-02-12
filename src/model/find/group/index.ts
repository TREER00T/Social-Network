import {RoomId} from "../../../util/Types";
import {findMany} from "../../../database/mongoDbDriverConnection";

let {
        group,
        groupUser,
        groupAdmin
    } = require('../../create/group'),
    {
        countRows
    } = require('../../../database/mongoDbDriverConnection');

export default {

    async id(id: string | RoomId) {

        if (typeof id === 'string') {

            let data = await group().findById(id, {
                _id: 1
            });

            return data?._id?.toString();
        }

        let data = await group().findOne({[id.type === 'groupId' ? '_id' : id.type]: id.id}, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async isPublicKeyUsed(publicLink: string) {

        let data = await group().findOne({
            publicLink: publicLink
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async links(groupId: string) {

        return await group().findById(groupId, {
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

    async getInfo(groupId: string, isOwnerOrAdmin: boolean) {

        if (isOwnerOrAdmin)
            return await group().findById(groupId);

        return await group().findById(groupId, {
            _id: 1,
            img: 1,
            name: 1,
            publicLink: 1,
            description: 1,
            defaultColor: 1
        });

    },

    async isOwnerOrAdmin(adminId: string, groupId: string) {

        let data = await groupAdmin().findOne({
            adminId: adminId,
            groupId: groupId
        }, {
            _id: 1
        });

        return !!data?._id?.toString();

    },

    async getCountOfUsers(groupId: string) {

        return await group().findById(groupId).countDocuments();

    },

    async getAllUsers(groupId: string) {

        return await groupUser().find({
            groupId: groupId
        }, {
            _id: 0,
            userId: 1
        });

    },

    async listOfAdmin(groupId: string) {

        return await groupAdmin().find({
            groupId: groupId
        }, {
            _id: 0,
            adminId: 1
        });

    },

    async getAvatarUrl(groupId: string) {

        let data = await group().findById(groupId, {
            _id: 0,
            img: 1
        });

        return data?.img;

    },

    async getListOfFileUrl(listOfId: string[], groupId: string) {
        return await findMany(listOfId.length > 0 ? {
            _id: {$in: listOfId}
        } : {fileUrl: {$ne: null}}, {
            _id: 0,
            fileUrl: 1
        }, `${groupId}GroupContents`);
    }
}