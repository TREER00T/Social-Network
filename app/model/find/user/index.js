let {
        isUndefined,
        isNotEmptyArr
    } = require('../../../util/Util'),
    {
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


module.exports = {


    async isMessageBelongForThisUserInE2E(messageId, senderId, e2eId) {

        let data = await findMany({
            id: {$in: messageId},
            senderId: senderId
        }, {
            projection: {
                _id: 1,
                senderId: 1
            }
        }, e2eId);

        return isNotEmptyArr(data);

    },


    async userPhone(phone) {

        let data = await user().findOne({
            phone: phone
        }, {
            projection: {
                _id: 0,
                phone: 1
            }
        });

        return !isUndefined(`${data.phone}`);

    },

    async isValidAuthCode(phone, authCode) {

        let data = await user().findOne({
            phone: phone,
            authCode: authCode
        }, {
            projection: {
                _id: 0,
                phone: 1,
                authCode: 1
            }
        });

        return isNotEmptyArr(data);

    },


    async getApiKeyAndUserId(phone) {

        let data = await user().findOne({
            phone: phone
        }, {
            projection: {
                _id: 1,
                apiKey: 1
            }
        });

        return data;

    },


    async password(phone) {

        let data = await user().findOne({
            phone: phone,
            password: {$ne: ''}
        }, {
            projection: {
                _id: 0,
                password: 1
            }
        });

        return data.password;

    },

    async isValidPassword(phone, password) {

        let data = await user().findOne({
            phone: phone,
            password: password
        }, {
            projection: {
                _id: 0,
                password: 1
            }
        });

        return !isUndefined(data.password);

    },


    async getApiKey(phone) {

        let data = await user().findOne({
            phone: phone
        }, {
            projection: {
                _id: 0,
                apiKey: 1
            }
        });

        return data.apiKey;

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
            projection: {
                _id: 0,
                tblChatId: 1
            }
        });

        return !isUndefined(result.tblChatId) ? result.tblChatId : false;

    },

    async isExist(userId) {

        let data = await user().findOne({
            _id: userId
        }, {
            projection: {
                _id: 1
            }
        });

        return !isUndefined(`${data._id}`);

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
            projection: {
                _id: 0,
                tblChatId: 1
            }
        });

        return !isUndefined(result.tblChatId) ? result.tblChatId : false;

    },


    async getListOfMessage(data) {

        if (!isUndefined(data.type)) {

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

        if (!isUndefined(data.search)) {

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
            projection: {
                _id: 0,
                bio: 1,
                img: 1,
                name: 1,
                isActive: 1,
                username: 1,
                lastName: 1,
                defaultColor: 1
            }
        });

        return data;

    },


    async getPersonalUserDetails(userId) {

        let data = await user().findById(userId, {
            projection: {
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
            }
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

        return isNotEmptyArr(result._id) ? `${result._id}` : false;

    },


    async isExistUsername(id) {

        let data = await user().findOne({
            username: id
        }, {
            projection: {
                _id: 0,
                username: 1
            }
        });

        return !isUndefined(data?.password);

    },


    async getListOfBlockUsers(id) {

        let data = await userBlockList().find({
            userId: id
        }, {
            projection: {
                _id: 0,
                userTargetId: 1
            }
        });

        return !isUndefined(data?.userTargetId) ? data?.userTargetId : false;

    },


    async getUserDetailsInUsersTable(array) {

        array.map(e => e.userTargetId);

        let data = await user().find({
            id: {$in: array}
        }, {
            projection: {
                _id: 1,
                img: 1,
                name: 1,
                username: 1
            }
        });

        return isUndefined(data) ? false : data;

    },


    async getUserDetailsInUsersTableForMember(array) {

        array.map(e => e.userId);

        let data = await user().find({
            id: {$in: array}
        }, {
            projection: {
                _id: 1,
                img: 1,
                name: 1,
                username: 1
            }
        });

        return isUndefined(data) ? false : data;

    },


    async getListOfDevices(id) {

        let data = await device().find({
            _id: id
        });

        return isUndefined(data) ? false : data;

    },

    async getTableNameForListOfUserGroups(groupId, userId) {

        let data = await listOfUserGroup().findOne({
            userId: userId,
            groupId: groupId
        }, {
            projection: {
                _id: 1
            }
        });

        return isNotEmptyArr(data);

    },

    async getTableNameForListOfUserChannels(channelId, userId) {

        let data = await listOfUserChannel().findOne({
            userId: userId,
            channelId: channelId
        }, {
            projection: {
                _id: 1
            }
        });

        return isNotEmptyArr(data);

    },

    async isSavedMessageCreated(phone) {

        return await haveCollection(`${phone}SavedMessage`);

    },


    async getListOfUserE2Es(userId) {

        let data = await listOfUserE2E().find({
            userId: userId
        }, {
            projection: {
                _id: 0,
                tblChatId: 1
            }
        });

        return isNotEmptyArr(data) ? data : false;

    },


    async getListOfUserGroup(userId) {

        let data = await listOfUserGroup().find({
            userId: userId
        }, {
            projection: {
                _id: 0,
                groupId: 1
            }
        });

        return isNotEmptyArr(data) ? data : false;

    },

    async getListOfUserChannel(userId) {

        let data = await listOfUserChannel().find({
            userId: userId
        }, {
            projection: {
                _id: 0,
                channelId: 1
            }
        });

        return isNotEmptyArr(data) ? data : false;

    }


}