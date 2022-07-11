let openSql = require('opensql');


module.exports = {

    group(name, inviteLink, defaultColor, img, cb) {

        if (img === undefined) {
            openSql.addOne({
                table: 'groups',
                data: {
                    name: name,
                    inviteLink: inviteLink,
                    defaultColor: defaultColor
                }
            }).result(result => {
                (result[1] !== undefined) ? cb(result[1].insertId) : cb(null);
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
            (result[1] !== undefined) ? cb(result[1].insertId) : cb(null);
        });

    },

    userIntoGroupAdmins(userId, groupId, isOwner) {
        openSql.addOne({
            table: 'groupsAdmins',
            data: {
                adminId: userId,
                groupId: groupId,
                isOwner: isOwner
            }
        });
    },

    userIntoGroup(userId, groupId) {
        openSql.addOne({
            table: 'groupsUsers',
            data: {
                userId: userId,
                groupId: groupId
            }
        });
    }

}