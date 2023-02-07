import Util from "../../../util/Util";

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
            messageCreatedBySenderId: senderId
        }, {
            _id: 1,
            messageCreatedBySenderId: 1
        }, tableName).toArray();

        return !Util.isUndefined(data);

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
                $or: [
                    {username: {$regex: like}},
                    {name: {$regex: like}},
                    {lastName: {$regex: like}}
                ]
            };

        let userData = await user().find(filter, {...projection, bio: 1, lastName: 1, username: 1});

        filter.$or[0] = {
            publicLink: {$regex: like}
        };

        filter.$or.pop();

        let groupData = await group().find(filter, projection),
            channelData = await channel().find(filter, projection);

        return {
            e2es: userData,
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
        }, `listOfUser${type}s`).toArray();


        return await findMany({
            _id: {$in: listOfId.map(e => `${e[objKey]}`)}
        }, {
            ...(type === 'e2e' ? {lastName: 1, bio: 1, username: 1} : {description: 1, publicLink: 1}),
            _id: 1,
            img: 1,
            name: 1,
            defaultColor: 1
        }, `${type === 'e2e' ? 'user' : type}s`).toArray();

    },


    async getListOfUsersActivity(userId: string) {

        let channelData = await this.getListOfUserGroupsChannelsOrE2EsActivity(userId, 'channel'),
            groupData = await this.getListOfUserGroupsChannelsOrE2EsActivity(userId, 'group'),
            e2eData = await this.getListOfUserGroupsChannelsOrE2EsActivity(userId, 'e2e');

        return {
            e2es: e2eData,
            groups: groupData,
            channels: channelData
        }

    }

}