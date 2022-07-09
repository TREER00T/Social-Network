let openSql = require('opensql'),
    {
        EQUAL_TO
    } = openSql.queryHelper,
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
                (result[1].length !== 0) ? cb(true) : cb(false);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}