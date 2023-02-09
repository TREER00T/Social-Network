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
            authCode: Number,
            username: String,
            password: String,
            lastName: String,
            isActive: Boolean,
            hasLogout: Boolean,
            defaultColor: String,
            twoStepVerification: Boolean
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


    savedMessage(userId) {

        createCollection(`${userId}SavedMessage`);

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