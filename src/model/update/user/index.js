let {user} = require('../../create/user'),
    {updateOne} = require('../../../database/mongoDbDriverConnection');


module.exports = {

    async authCode(phone, authCode) {

        await user().updateOne({phone: phone}, {$set: {authCode: authCode}});

    },


    async apikey(phone, key) {

        await user().updateOne({phone: phone}, {$set: {apiKey: key}});

    },


    async userOnline(phone, status) {

        await user().updateOne({phone: phone}, {$set: {isActive: status}});

    },


    async username(phone, username) {

        await user().updateOne({phone: phone}, {$set: {username: username}});

    },


    async bio(phone, bio = '') {

        await user().updateOne({phone: phone}, {$set: {bio: bio}});

    },


    async name(phone, firstName, lastName) {

        await user().updateOne({phone: phone}, {
            $set: {
                name: firstName,
                lastName: lastName
            }
        });

    },

    async passwordAndEmail(phone, password = '', email = '') {

        await user().updateOne({phone: phone}, {
            $set: {
                password: password,
                email: email
            }
        });

    },

    async password(phone, password) {

        await user().updateOne({phone: phone}, {$set: {password: password}});

    },

    async img(phone, url) {

        await user().updateOne({phone: phone}, {$set: {img: url}});

    },

    async itemInSavedMessage(userId, messageId, data) {

        await updateOne(data, {_id: messageId}, `${userId}SavedMessage`);

    },

    async twoStepVerificationState(userPhone, state) {

        await user().updateOne({phone: userPhone}, {$set: {twoStepVerification: state}});

    },

    async logoutUser(phone, hasLogout) {

        await user().updateOne({phone: phone}, {$set: {hasLogout: hasLogout}});

    }

}