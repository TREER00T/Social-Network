let {
        findMany
    } = require('../../../database/mongoDbDriverConnection'),
    {user} = require('../../create/user'),
    {group} = require('../../create/group'),
    {channel} = require('../../create/channel');


export default {

    async isMessageBelongForThisUserInRoom(messageId: string | string[], senderId: string, tableName: string) {

        let data = await findMany({
            _id: {$in: messageId},
            senderId: senderId
        }, {
            _id: 1,
            senderId: 1
        }, tableName);

        return data?._id;

    },

    async searchWithNameInTableUsersGroupsAndChannels(value: string) {

        if (!value)
            return false;

        let like = new RegExp(value),
            projection = {
                _id: 1,
                img: 1,
                name: 1,
                defaultColor: 1
            }, filter: any = {
                name: {$regex: like},
                $or: [{
                    username: {$regex: like}
                }]
            };

        let userData = await user().find(filter, projection);

        filter.$or[0] = {
            publicLink: {$regex: like}
        };

        let groupData = await group().find(filter, projection),
            channelData = await channel().find(filter, projection);

        return {
            users: userData,
            groups: groupData,
            channels: channelData
        }

    },

    async getListOfUserGroupsChannelsOrE2EsActivity(userId: string, type: string) {

        let objKey = type === 'channel' ? 'channelId' :
            type === 'e2e' ? 'userId' : 'groupId';

        let listOfId = await findMany({
            userId: userId
        }, {
            _id: 0,
            [objKey]: 1
        }, `listOfUser${type}s`);

        listOfId.map(e => `${e[objKey]}`);

        return await findMany({
            _id: {$in: listOfId}
        }, {
            _id: 1,
            img: 1,
            name: 1,
            defaultColor: 1
        }, `${type === 'e2e' ? 'user' : type}s`);

    },


    async getListOfUsersActivity(userId: string) {

        let channelData = await this.getListOfUserGroupsChannelsOrE2EsActivity(userId, 'channel'),
            groupData = await this.getListOfUserGroupsChannelsOrE2EsActivity(userId, 'group'),
            e2eData = await this.getListOfUserGroupsChannelsOrE2EsActivity(userId, 'e2e');

        return {
            users: e2eData,
            groups: groupData,
            channels: channelData
        }

    },

    async isForwardData(tableName: string, id: string) {

        if (!id)
            return false;

        return await findMany({
            _id: id
        }, {
            _id: 0,
            forwardDataId: 1
        }, tableName);

    }

}