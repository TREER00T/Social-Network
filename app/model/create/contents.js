let openSql = require('app/database/OpenSql'),
    {
        INT,
        ENUM
    } = require('app/database/util/DataType'),
    {
        NOT_NULL,
        AUTO_INCREMENT
    } = require('app/database/util/SqlKeyword');


module.exports = {


    forwardContents() {

        openSql.createTable({
            table: `forwardContents`,
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                conversationId: INT(),
                conversationType: ENUM(['Group', 'Channel', 'E2E', 'Personal'])
            },
            primaryKey: 'id'
        })

    }


}