let {model} = require('./creator'),
    {createCollection} = require('../../database/mongoDbDriverConnection');


module.exports = {

    user() {

        return model({
            img: String,
            bio: String,
            name: String,
            email: String,
            phone: String,
            apiKey: String,
            isActive: Boolean,
            authCode: Number,
            username: String,
            password: String,
            lastName: String,
            isBlocked: Boolean,
            defaultColor: String
        }, 'user');

    },


    listOfUserGroup() {

        return model({
            userId: String,
            groupId: String
        }, 'listOfUserGroup');

    },


    listOfUserE2E() {

        return model({
            toUser: String,
            fromUser: String,
            userId: String,
            tblChatId: String
        }, 'listOfUserE2E');

    },


    listOfUserChannel() {

        return model({
            userId: String,
            channelId: String
        }, 'listOfUserChannel');

    },


    savedMessage(phone) {

        createCollection(`${phone}SavedMessage`);

    },


    device() {

        return model({
            userId: String,
            deviceIp: String,
            createdAt: Date,
            deviceName: String,
            deviceLocation: String
        }, 'device');

    },


    userBlockList() {

        return model({
            userId: String,
            userTargetId: String
        }, 'userBlockList');

    },


    e2eContent(fromUser, toUser) {

        createCollection(`${fromUser}And${toUser}E2EContents`);

    }

}