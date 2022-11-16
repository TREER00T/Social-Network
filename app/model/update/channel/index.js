let {channel} = require('../../create/channel');


module.exports = {

    async img(id, url) {

        await channel().findByIdAndUpdate(id, {img: url});

        return true;

    },

    async name(id, name) {

        await channel().findByIdAndUpdate(id, {name: name});

        return true;

    },

    async description(id, description = '') {

        await channel().findByIdAndUpdate(id, {description: description});

        return true;

    },

    async inviteLink(id, link) {

        await channel().findByIdAndUpdate(id, {
            inviteLink: link,
            publicLink: ''
        });

        return true;

    },

    async publicLink(id, link) {

        await channel().findByIdAndUpdate(id, {
            inviteLink: '',
            publicLink: link
        });

        return true;

    }

}