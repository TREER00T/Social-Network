let openSql = require('opensql'),
    {
        EQUAL_TO
    } = openSql.queryHelper,
    {
        AND
    } = openSql.keywordHelper,
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    groupId(id, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: ['id', 'groups', 'id', `${id}`],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    group(id, cb) {
        openSql.find({
            optKey: [
                EQUAL_TO
            ],
            data: ['id', 'groups', 'id', `${id}`],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    },

    isOwnerOfGroup(adminId, groupId, cb) {
        let isOwner = 1;
        openSql.find({
            optKey: [
                EQUAL_TO,
                AND,
                EQUAL_TO,
                AND,
                EQUAL_TO
            ],
            data: [
                'id', 'groupsAdmins',
                'adminId', `${adminId}`,
                'groupId', `${groupId}`,
                'isOwner', isOwner
            ],
            where: true
        }).result(result => {
            try {
                cb(result[1].length !== 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}