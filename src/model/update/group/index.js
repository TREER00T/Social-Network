let {group} = require('../../create/group');


module.exports = {


    async img(id, url) {

        await group().findByIdAndUpdate(id, {img: url});

    },

    async name(id, name) {

        await group().findByIdAndUpdate(id, {name: name});

    },

    async description(id, description = '') {

        await group().findByIdAndUpdate(id, {description: description});

    },

    async inviteLink(id, link) {

        await group().findByIdAndUpdate(id, {
            inviteLink: link,
            publicLink: ''
        });

    },

    async publicLink(id, link) {

        await group().findByIdAndUpdate(id, {
            inviteLink: '',
            publicLink: link
        });

    }


}