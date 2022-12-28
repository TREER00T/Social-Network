let {user} = require('../../create/user'),
    {updateOne} = require('../../../database/mongoDbDriverConnection');


module.exports = {

    async authCode(phone, authCode) {

        await user().updateOne({phone: phone}, {$set: {authCode: authCode}});

        return true;

    },


    async apikey(phone, key) {

        await user().updateOne({phone: phone}, {$set: {apiKey: key}});

        return true;

    },


    async userOnline(phone, status) {

        await user().updateOne({phone: phone}, {$set: {isActive: status}});

        return true;

    },


    async username(phone, username) {

        await user().updateOne({phone: phone}, {$set: {username: username}});

        return true;

    },


    async bio(phone, bio = '') {

        await user().updateOne({phone: phone}, {$set: {bio: bio}});

        return true;

    },


    async name(phone, firstName, lastName) {

        if (typeof lastName === 'string')
            lastName = lastName.toString().trim();

        await user().updateOne({phone: phone}, {
            $set: {
                name: firstName,
                lastName: lastName
            }
        });

        return true;

    },

    async passwordAndEmail(phone, password = '', email = '') {

        await user().updateOne({phone: phone}, {
            $set: {
                password: password, email: email
            }
        });

        return true;

    },

    async password(phone, password) {

        await user().updateOne({phone: phone}, {$set: {password: password}});

        return true;

    },

    async img(phone, url) {

        await user().updateOne({phone: phone}, {$set: {img: url}});

        return true;

    },

    async itemInSavedMessage(phone, id, data) {

        await updateOne(data, {_id: id}, `${phone}SavedMessage`);

    }

}