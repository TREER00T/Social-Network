let openSql = require('opensql'),
    {
        isUndefined
    } = require('app/util/Util');


module.exports = {

    group(name, inviteLink, defaultColor, img, cb) {

        if (isUndefined(img)) {
            openSql.addOne({
                table: 'groups',
                data: {
                    name: name,
                    inviteLink: inviteLink,
                    defaultColor: defaultColor
                }
            }).result(result => {
                !isUndefined(result[1]?.insertId) ? cb(result[1].insertId) : cb(null);
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
            !isUndefined(result[1]?.insertId) ? cb(result[1].insertId) : cb(null);
        });

    },

    admin(userId, groupId, isOwner) {
        openSql.addOne({
            table: 'groupsAdmins',
            data: {
                adminId: userId,
                groupId: groupId,
                isOwner: isOwner
            }
        });
    },

    user(userId, groupId) {
        openSql.addOne({
            table: 'groupsUsers',
            data: {
                userId: userId,
                groupId: groupId
            }
        });
    }

}