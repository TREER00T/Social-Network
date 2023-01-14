let {channel} = require('../../create/channel');


module.exports = {

    async img(id, url) {

        await channel().findByIdAndUpdate(id, {img: url});

    },

    async name(id, name) {

        await channel().findByIdAndUpdate(id, {name: name});

    },

    async description(id, description = '') {

        await channel().findByIdAndUpdate(id, {description: description});

    },

    async inviteLink(id, link) {

        await channel().findByIdAndUpdate(id, {
            inviteLink: link,
            publicLink: ''
        });

    },

    async publicLink(id, link) {

        await channel().findByIdAndUpdate(id, {
            inviteLink: '',
            publicLink: link
        });

    }

}