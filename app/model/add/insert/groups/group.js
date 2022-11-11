let openSql = require('opensql'),
    {
        isUndefined
    } = require('../../../../util/Util');


module.exports = {

    async group(name, inviteLink, defaultColor, img) {

        return new Promise(res => {

            if (isUndefined(img)) {
                openSql.addOne({
                    table: 'groups',
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
                table: 'groups',
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

    async admin(userId, groupId, isOwner) {
        await openSql.addOne({
            table: 'groupsAdmins',
            data: {
                adminId: userId,
                groupId: groupId,
                isOwner: isOwner
            }
        });
    },

    async user(userId, groupId) {
        await openSql.addOne({
            table: 'groupsUsers',
            data: {
                userId: userId,
                groupId: groupId
            }
        });
    }

}