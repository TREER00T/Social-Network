let {group} = require('../../create/group');


module.exports = {


    async img(id, url) {

        await group().findByIdAndUpdate(id, {img: url});

        return true;

    },

    async name(id, name) {

        await group().findByIdAndUpdate(id, {name: name});

        return true;

    },

    async description(id, description = '') {

        await group().findByIdAndUpdate(id, {description: description});

        return true;

    },

    async inviteLink(id, link) {

        await group().findByIdAndUpdate(id, {
            inviteLink: link,
            publicLink: ''
        });

        return true;

    },

    async publicLink(id, link) {

        await group().findByIdAndUpdate(id, {
            inviteLink: '',
            publicLink: link
        });

        return true;

    }


}