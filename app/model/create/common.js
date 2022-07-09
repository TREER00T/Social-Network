let openSql = require('opensql'),
    {
        INT,
        ENUM
    } = openSql.dataType,
    {
        NOT_NULL
    } = openSql.queryHelper,
    {
        AUTO_INCREMENT
    } = openSql.keywordHelper;


module.exports = {


    forwardContents() {

        openSql.createTable({
            table: `forwardContents`,
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                messageId: INT(),
                conversationId: INT(),
                conversationType: ENUM(['Group', 'Channel', 'E2E', 'Personal'])
            },
            primaryKey: 'id'
        });

    }


}