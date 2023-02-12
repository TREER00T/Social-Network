import {ObjectId} from "mongodb";
import Util from '../../../util/Util';
import FindInGroup from '../../../model/find/group';
import FindInChannel from '../../../model/find/channel';
import {
    AuthMsgBelongingToBetweenTwoUsers,
    ListOfAdmin,
    ListOfUserId,
    ListOfUserTargetId,
    UserIdWithType
} from "../../../util/Types";

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


    async haveFirstName(phone: string) {

        let data = await user().findOne({
            phone: phone
        }, {
            _id: 0,
            name: 1
        });

        return data?.name;

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

        let result = await listOfUserE2E().find({
            $or: [
                {fromUser: data.toUser, toUser: data.fromUser},
                {fromUser: data.fromUser, toUser: data.toUser}
            ]
        }, {
            _id: 0,
            tblChatId: 1
        });

        return result[0]?.tblChatId;

    },

    async isExist(userId: string | UserIdWithType) {

        let data;

        if (typeof userId === 'string') {
            data = await user().findById(userId, {
                _id: 1
            });
        } else {
            data = await user().findOne({
                [userId.type]: userId.id
            }, {
                _id: 1
            });
        }

        return data?._id?.toString();

    },

    async getListOfMessage(data) {

        const queryFilter = async queryResult => {
            let query = await queryResult.sort({
                [data.order]: data.sort?.toLowerCase()
            });

            if (data.limit > 1)
                query.limit(data.limit);

            if (data.startFrom > 1)
                query.skip(data.startFrom);

            let result = await query.toArray();

            for (let i in result) {
                let d = result[i];
                let haveFromGroupRoom = /(.*?)GroupContents/.test(d.messageSentRoomId);
                let haveFromChannelRoom = /(.*?)ChannelContents/.test(d.messageSentRoomId);

                const getChannelInfo = async () => await FindInChannel.getInfo(d.messageSentRoomId),
                    getUserInfo = async () => await this.getUserPvDetails(d.messageCreatedBySenderId);

                if (haveFromGroupRoom)
                    result[i].forwardData = await getUserInfo();

                if (haveFromChannelRoom)
                    result[i].forwardData = await getChannelInfo();

                if (haveFromGroupRoom || haveFromGroupRoom) {
                    delete result[i].messageCreatedBySenderId;
                    delete result[i].messageSentRoomId;
                }
            }

            return result;
        }

        if (data.type) {

            let queryResult = await findMany({
                type: data.type
            }, data.tableName, true);

            return await queryFilter(queryResult);
        }

        if (data.search) {

            let queryResult = await findMany({
                text: {$regex: new RegExp(data.search)}
            }, data.tableName, true);

            return await queryFilter(queryResult);
        }

        let queryResult = await findMany(data.tableName, true);

        return await queryFilter(queryResult);

    },

    async getCountOfListMessage(tableName: string) {

        return await countRows(tableName);

    },

    async getUserPvDetails(userId: string | UserIdWithType) {
        let projection = {
            _id: 1,
            bio: 1,
            img: 1,
            name: 1,
            isActive: 1,
            username: 1,
            lastName: 1,
            defaultColor: 1
        };

        if (typeof userId === 'string')
            return await user().findById(userId, projection);

        return await user().findOne({[userId.type]: userId.id}, projection);
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

        return Util.isNotEmptyArr(result?.[0]?._id?.toString());

    },

    async hasBlockedByUser(from: string, targetId: string) {

        let result = await userBlockList().findOne({
            userId: from,
            userTargetId: targetId
        });

        return result?._id?.toString();

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


    async getUserDetailsInUsersTable(array: ListOfUserTargetId | ListOfAdmin) {

        let arr = array.map(e => new ObjectId(e?.userTargetId ? e.userTargetId : e.adminId));

        let data = await user().find({
            _id: {$in: arr}
        }, {
            _id: 1,
            img: 1,
            name: 1,
            isActive: 1,
            lastName: 1,
            username: 1,
            defaultColor: 1
        });

        return !Util.isNotEmptyArr(data) ? false : data;

    },

    async getUserDetailsInUsersTableForMember(array: ListOfUserId) {

        let arr = array.map(e => new ObjectId(e.userId));

        let data = await user().find({
            _id: {$in: arr}
        }, {
            _id: 1,
            bio: 1,
            img: 1,
            name: 1,
            isActive: 1,
            lastName: 1,
            username: 1,
            defaultColor: 1
        });

        return !Util.isNotEmptyArr(data) ? false : data;

    },


    async getListOfDevices(id: string) {

        let data = await device().find({
            userId: id
        });

        return !Util.isNotEmptyArr(data) ? false : data;

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

    async isSavedMessageCreated(userId: string) {

        return await haveCollection(`${userId}SavedMessage`);

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

        data = data?.filter(async d => !(await FindInGroup.isOwner(userId, d.groupId)));

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

        data = data?.filter(async d => !(await FindInChannel.isOwner(userId, d.channelId)));

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

        return data?.map(d => d.toUser);
    },

    async hasLogout(userId: string) {
        let data = await user().findById(userId);

        return data?.hasLogout;
    }

}