let openSql = require('app/database/OpenSql'),
    {
        EQUAL_TO
    } = require('app/database/util/SqlKeyword'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');




module.exports = {

    groupId(id, cb) {
        openSql.find({
            optionKeyword: [
                EQUAL_TO
            ],
            data: ['id', 'groups', 'id', `${id}`],
            where: true
        }).result(result => {
            try {
                (result[1].length !== 0) ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}