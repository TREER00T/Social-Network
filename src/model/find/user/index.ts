let {
        haveCollection,
        findMany,
        countRows
    } = require('../../../database/mongoDbDriverConnection'),
    {
        user,
        device,
        userBlockList,
        listOfUserE2E,
        listOfUserGroup,
        listOfUserChannel
    } = require('../../create/user');
import Util from '../../../util/Util';
import FindInGroup from '../../../model/find/group';
import FindInChannel from '../../../model/find/channel';

export default {

    async userPhone(phone) {

        let data = await user().findOne({
            phone: phone
        }, {
            _id: 0,
            phone: 1
        });

        return data?.phone;

    },

    async isValidAuthCode(phone, authCode) {

        let data = await user().findOne({
            phone: phone,
            authCode: authCode
        }, {
            _id: 0,
            authCode: 1
        });

        return data?.authCode;

    },


    async getApiKeyAndUserId(phone) {

        let data = await user().findOne({
            phone: phone
        }, {
            _id: 1,
            apiKey: 1
        });

        return data;

    },


    async password(phone) {

        let data = await user().findOne({
            phone: phone,
            password: {$ne: ''}
        }, {
            _id: 0,
            password: 1
        });

        return data?.password;

    },

    async isValidPassword(phone, password) {

        let data = await user().findOne({
            phone: phone,
            password: password
        }, {
            _id: 0,
            password: 1
        });

        return data?.password;

    },


    async getApiKey(phone) {

        let data = await user().findOne({
            phone: phone
        }, {
            _id: 0,
            apiKey: 1
        });

        return data?.apiKey;

    },


    async isExistChatRoom(data) {

        let result = await listOfUserE2E().findOne({
            toUser: data.toUser,
            fromUser: data.fromUser,
            $or: [
                {toUser: data.fromUser},
                {fromUser: data.toUser}
            ]
        }, {
            _id: 0,
            tblChatId: 1
        });

        return !Util.isUndefined(result?.tblChatId) ? result?.tblChatId : false;

    },

    async isExist(userId) {

        let data = await user().findOne({
            _id: userId
        }, {
            _id: 1
        });

        return !Util.isUndefined(`${data._id}`);

    },


    async getTableNameForListOfE2EMessage(fromUser, toUser, userId) {

        let result = await listOfUserE2E().findOne({
            toUser: toUser,
            fromUser: fromUser,
            userId: userId,
            $or: [
                {toUser: fromUser},
                {fromUser: toUser},
                {userId: userId}
            ]
        }, {
            _id: 0,
            tblChatId: 1
        });

        return !Util.isUndefined(result?.tblChatId) ? result?.tblChatId : false;

    },


    async getListOfMessage(data) {

        if (!Util.isUndefined(data.type)) {

            let queryResult = await findMany({
                type: data.type
            }, data.tableName);

            let queryFilter = await queryResult.sort({
                [data.order === 'id' ? '_id' : data.order]: data.sort.toLowerCase(),
                $limit: data.limit
            });

            if (data.startFrom !== 0)
                queryFilter.skip(data.startFrom);

            return queryFilter;
        }

        if (!Util.isUndefined(data.search)) {

            let queryResult = await findMany({
                text: {$regex: new RegExp(data.search)}
            }, data.tableName);

            let queryFilter = await queryResult.sort({
                [data.order === 'id' ? '_id' : data.order]: 'desc',
                $limit: data.limit
            });

            if (data.startFrom !== 0)
                queryFilter.skip(data.startFrom);

            return queryFilter;
        }

        let queryResult = await findMany(data.tableName);

        let queryFilter = await queryResult.sort({
            [data.order === 'id' ? '_id' : data.order]: data.sort.toLowerCase(),
            $limit: data.limit
        });

        if (data.startFrom !== 0)
            queryFilter.skip(data.startFrom);

        return queryFilter;

    },

    async getCountOfListMessage(tableName) {

        return await countRows(tableName);

    },

    async getUserPvDetails(userId) {

        let data = await user().findById(userId, {
            _id: 0,
            bio: 1,
            img: 1,
            name: 1,
            isActive: 1,
            username: 1,
            lastName: 1,
            defaultColor: 1
        });

        return data;

    },


    async getPersonalUserDetails(userId) {

        let data = await user().findById(userId, {
            _id: 0,
            bio: 1,
            img: 1,
            name: 1,
            email: 1,
            phone: 1,
            isActive: 1,
            username: 1,
            lastName: 1,
            defaultColor: 1
        });

        return data;

    },


    async isBlock(from, targetId) {

        let result = await userBlockList().findOne({
            userId: from,
            userTargetId: targetId,
            $or: [
                {userId: targetId},
                {userTargetId: from}
            ]
        });

        return Util.isNotEmptyArr(result._id) ? `${result._id}` : false;

    },


    async isExistUsername(id) {

        let data = await user().findOne({
            username: id
        }, {
            _id: 0,
            username: 1
        });

        return !Util.isUndefined(data?.password);

    },


    async getListOfBlockedUsers(id) {

        let data = await userBlockList().find({
            userId: id
        }, {
            _id: 0,
            userTargetId: 1
        });

        return !Util.isUndefined(data?.userTargetId) ? data?.userTargetId : false;

    },


    async getUserDetailsInUsersTable(array) {

        array.map(e => e.userTargetId);

        let data = await user().find({
            id: {$in: array}
        }, {
            _id: 1,
            img: 1,
            name: 1,
            username: 1
        });

        return Util.isUndefined(data) ? false : data;

    },


    async getUserDetailsInUsersTableForMember(array) {

        array.map(e => e.userId);

        let data = await user().find({
            id: {$in: array}
        }, {
            _id: 1,
            img: 1,
            name: 1,
            username: 1
        });

        return Util.isUndefined(data) ? false : data;

    },


    async getListOfDevices(id) {

        let data = await device().find({
            _id: id
        });

        return Util.isUndefined(data) ? false : data;

    },

    async getTableNameForListOfUserGroups(groupId, userId) {

        let data = await listOfUserGroup().findOne({
            userId: userId,
            groupId: groupId
        }, {
            _id: 1
        });

        return Util.isNotEmptyArr(data);

    },

    async getTableNameForListOfUserChannels(channelId, userId) {

        let data = await listOfUserChannel().findOne({
            userId: userId,
            channelId: channelId
        }, {
            _id: 1
        });

        return Util.isNotEmptyArr(data);

    },

    async isSavedMessageCreated(phone) {

        return await haveCollection(`${phone}SavedMessage`);

    },


    async getListOfUserE2Es(userId) {

        let data = await listOfUserE2E().find({
            userId: userId
        }, {
            _id: 0,
            tblChatId: 1
        });

        return Util.isNotEmptyArr(data) ? data : false;

    },


    async getListOfUserCreatedGroup(userId) {

        let data = await listOfUserGroup().find({
            userId: userId
        }, {
            _id: 0,
            groupId: 1
        });

        return Util.isNotEmptyArr(data) ? data : false;

    },

    async getListOfUserJoinedGroup(userId) {

        let data = await listOfUserGroup().find({
            userId: userId
        }, {
            _id: 0,
            groupId: 1
        });

        if (!Util.isNotEmptyArr(data))
            return false;

        data?.filter(async d => !(await FindInGroup.isOwner(userId, d.groupId)));

        return Util.isNotEmptyArr(data) ? data : false;

    },

    async getListOfUserCreatedChannel(userId) {

        let data = await listOfUserChannel().find({
            userId: userId
        }, {
            _id: 0,
            channelId: 1
        });

        return Util.isNotEmptyArr(data) ? data : false;

    },

    async getListOfUserJoinedChannel(userId) {

        let data = await listOfUserChannel().find({
            userId: userId
        }, {
            _id: 0,
            channelId: 1
        });

        if (!Util.isNotEmptyArr(data))
            return false;

        data?.filter(async d => !(await FindInChannel.isOwner(userId, d.channelId)));

        return Util.isNotEmptyArr(data) ? data : false;

    },

    async getUsersFromListOfUser(userId) {
        let data = await listOfUserE2E().find({
            userId: userId,
            fromUser: userId
        }, {
            _id: 0,
            toUser: 1
        });

        data?.map(d => d.toUser);

        return data;
    }

}