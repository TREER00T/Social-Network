let {model} = require('./creator'),
    {createCollection} = require('../../database/mongoDbDriverConnection');

module.exports = {


    group() {

        return model({
            img: String,
            name: String,
            inviteLink: String,
            publicLink: String,
            description: String,
            defaultColor: String
        }, 'group');

    },


    groupUser() {

        return model({
            userId: String,
            groupId: String
        }, 'groupUser');

    },


    groupAdmin() {

        return model({
            adminId: String,
            groupId: String,
            isOwner: Boolean
        }, 'groupAdmin');

    },


    async groupContent(groupId) {

        await createCollection(`${groupId}GroupContents`);

    }


}