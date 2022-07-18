let openSql = require('opensql'),
    {
        INT,
        ENUM,
        LONGTEXT
    } = openSql.dataType,
    {
        NOT_NULL,
        NULL
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
                messageId: INT([NULL]),
                conversationId: LONGTEXT(),
                conversationType: ENUM(['Group', 'Channel', 'E2E', 'Personal'])
            },
            primaryKey: 'id'
        });

    }


}