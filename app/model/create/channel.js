let {model} = require('./creator'),
    {createCollection} = require('../../database/mongoDbDriverConnection');


module.exports = {

    async channelContent(channelId) {

        await createCollection(`${channelId}ChannelContents`);

    },


    channelUser() {

        return model({
            userId: String,
            channelId: String
        }, 'channelUser');

    },


    channel() {

        return model({
            img: String,
            name: String,
            inviteLink: String,
            publicLink: String,
            description: String,
            defaultColor: String
        }, 'channel');

    },


    channelAdmin() {

        return model({
            adminId: String,
            isOwner: Boolean,
            channelId: String
        }, 'channelAdmin');

    }


}