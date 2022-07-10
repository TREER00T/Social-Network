let openSql = require('opensql'),
    {
        DataBaseException
    } = require('app/exception/DataBaseException');


module.exports = {

    img(id, url, cb) {
        openSql.update({
            table: 'groups',
            edit: {
                img: `${url}`
            },
            where: {
                id: `${id}`
            }
        }).result(result => {
            try {
                cb(result[1].changedRows > 0);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}