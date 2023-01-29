import {ObjectId} from "mongodb";

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
import {AuthMsgBelongingToBetweenTwoUsers, ListOfUserId, ListOfUserTargetId} from "../../../util/Types";


export default {

    async userPhone(phone: string) {

        let data = await user().findOne({
            phone: phone
        }, {
            _id: 0,
            phone: 1
        });

        return data?.phone;

    },

    async userId(phone: string) {

        let data = await user().findOne({
            phone: phone
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async isValidAuthCode(phone: string, authCode: number) {

        let data = await user().findOne({
            phone: phone,
            authCode: authCode
        }, {
            _id: 0,
            authCode: 1
        });

        return data?.authCode;

    },


    async getApiKeyAndUserId(phone: string) {

        return await user().findOne({
            phone: phone
        }, {
            _id: 1,
            apiKey: 1
        });

    },


    async password(phone: string) {

        let data = await user().findOne({
            phone: phone,
            password: {$ne: ''}
        }, {
            _id: 0,
            password: 1
        });

        return data?.password;

    },

    async isValidPassword(phone: string, password: string) {

        let data = await user().findOne({
            phone: phone,
            password: password
        }, {
            _id: 0,
            password: 1
        });

        return data?.password;

    },


    async getApiKey(phone: string) {

        let data = await user().findOne({
            phone: phone
        }, {
            _id: 0,
            apiKey: 1
        });

        return data?.apiKey;

    },


    async isExistChatRoom(data: AuthMsgBelongingToBetweenTwoUsers) {

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

        return result?.tblChatId;

    },

    async isExist(userId: string) {

        let data = await user().findOne({
            _id: userId
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },


    async getTableNameForListOfE2EMessage(fromUser: string, toUser: string) {

        let result = await listOfUserE2E().findOne({
            $or: [
                {fromUser: toUser, toUser: fromUser},
                {fromUser: fromUser, toUser: toUser}
            ]
        }, {
            _id: 0,
            tblChatId: 1
        });


        return result?.tblChatId?.toString();

    },


    async getListOfMessage(data) {

        if (!Util.isUndefined(data?.type)) {

            let queryResult = await findMany({
                type: data.type
            }, data.tableName);

            let queryFilter = await queryResult.sort({
                [data.order === 'id' ? '_id' : data.order]: data.sort.toLowerCase(),
            });

            queryResult.limit(data.limit);

            if (data.startFrom !== 0)
                queryFilter.skip(data.startFrom);

            return queryFilter.toArray();
        }

        if (!Util.isUndefined(data.search)) {

            let queryResult = await findMany({
                text: {$regex: new RegExp(data.search)}
            }, data.tableName);


            let queryFilter = await queryResult.sort({
                [data.order === 'id' ? '_id' : data.order]: data.sort.toLowerCase()
            });

            queryResult.limit(data.limit);

            if (data.startFrom !== 0)
                queryFilter.skip(data.startFrom);

            return queryFilter.toArray();
        }

        let queryResult = await findMany(data.tableName);

        let queryFilter = await queryResult.sort({
            [data.order === 'id' ? '_id' : data.order]: data.sort.toLowerCase(),
        });

        queryResult.limit(data.limit);

        if (data.startFrom !== 0)
            queryFilter.skip(data.startFrom);

        return queryFilter.toArray();

    },

    async getCountOfListMessage(tableName: string) {

        return await countRows(tableName);

    },

    async getUserPvDetails(userId: string) {

        return await user().findById(userId, {
            _id: 0,
            bio: 1,
            img: 1,
            name: 1,
            isActive: 1,
            username: 1,
            lastName: 1,
            defaultColor: 1
        });

    },


    async getPersonalUserDetails(userId: string) {

        return await user().findById(userId, {
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

    },


    async isBlock(from: string, targetId: string) {

        let result = await userBlockList().findOne({
            $or: [
                {userId: targetId, userTargetId: from},
                {userId: from, userTargetId: targetId}
            ]
        });

        return Util.isNotEmptyArr(result?._id?.toString()) ? `${result?._id}` : false;

    },


    async isExistUsername(id: string) {

        let data = await user().findOne({
            username: id
        }, {
            _id: 0,
            username: 1
        });

        return data?.username;

    },


    async getListOfBlockedUsers(id: string) {

        let data = await userBlockList().find({
            userId: id
        }, {
            _id: 0,
            userTargetId: 1
        });

        return data[0]?.userTargetId ? data : false;

    },


    async getUserDetailsInUsersTable(array: ListOfUserTargetId) {

        let arr = array.map(e => new ObjectId(e.userTargetId));

        let data = await user().find({
            _id: {$in: arr}
        }, {
            _id: 1,
            img: 1,
            name: 1,
            lastName: 1,
            isActive: 1,
            username: 1,
            defaultColor: 1
        });

        return Util.isUndefined(data) ? false : data;

    },


    async getUserDetailsInUsersTableForMember(array: ListOfUserId) {

        let arr = array.map(e => new ObjectId(e.userId));

        let data = await user().find({
            _id: {$in: arr}
        }, {
            _id: 1,
            img: 1,
            name: 1,
            username: 1
        });

        return Util.isUndefined(data) ? false : data;

    },


    async getListOfDevices(id: string) {

        let data = await device().find({
            userId: id
        });

        return Util.isUndefined(data) ? false : data;

    },

    async getTableNameForListOfUserGroups(groupId: string, userId: string) {

        let data = await listOfUserGroup().findOne({
            userId: userId,
            groupId: groupId
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async getTableNameForListOfUserChannels(channelId: string, userId: string) {

        let data = await listOfUserChannel().findOne({
            userId: userId,
            channelId: channelId
        }, {
            _id: 1
        });

        return data?._id?.toString();

    },

    async isSavedMessageCreated(phone: string) {

        return await haveCollection(`${phone}SavedMessage`);

    },


    async getListOfUserE2Es(userId: string) {

        let data = await listOfUserE2E().find({
            userId: userId
        }, {
            _id: 0,
            tblChatId: 1
        });

        return Util.isNotEmptyArr(data) ? data : false;

    },


    async getListOfUserCreatedGroup(userId: string) {

        let data = await listOfUserGroup().find({
            userId: userId
        }, {
            _id: 0,
            groupId: 1
        });

        return Util.isNotEmptyArr(data) ? data : false;

    },

    async getListOfUserJoinedGroup(userId: string) {

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

    async getListOfUserCreatedChannel(userId: string) {

        let data = await listOfUserChannel().find({
            userId: userId
        }, {
            _id: 0,
            channelId: 1
        });

        return Util.isNotEmptyArr(data) ? data : false;

    },

    async getListOfUserJoinedChannel(userId: string) {

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

    async getUsersFromListOfUser(userId: string) {
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