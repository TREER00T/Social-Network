let openSql = require('opensql'),
    {
        isUndefined
    } = require('../../../../util/Util');


module.exports = {

    async channel(name, inviteLink, defaultColor, img) {

        return new Promise(res => {

            if (isUndefined(img)) {
                openSql.addOne({
                    table: 'channels',
                    data: {
                        name: name,
                        inviteLink: inviteLink,
                        defaultColor: defaultColor
                    }
                }).result(result => {
                    !isUndefined(result[1]?.insertId) ? res(result[1].insertId) : res(null);
                });
                return;
            }

            openSql.addOne({
                table: 'channels',
                data: {
                    img: img,
                    name: name,
                    inviteLink: inviteLink,
                    defaultColor: defaultColor
                }
            }).result(result => {
                !isUndefined(result[1]?.insertId) ? res(result[1].insertId) : res(null);
            });

        });

    },

    async userIntoChannelsAdmins(userId, channelId, isOwner) {
        await openSql.addOne({
            table: 'channelsAdmins',
            data: {
                adminId: userId,
                channelId: channelId,
                isOwner: isOwner
            }
        });
    },

    async userIntoChannel(userId, channelId) {
        await openSql.addOne({
            table: 'channelsUsers',
            data: {
                userId: userId,
                channelId: channelId
            }
        });
    }

}