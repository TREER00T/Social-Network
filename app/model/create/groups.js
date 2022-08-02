let openSql = require('opensql'),
    {
        INT,
        ENUM,
        POINT,
        BOOLEAN,
        VARCHAR,
        DATETIME
    } = openSql.dataType,
    {
        NULL,
        NOT_NULL
    } = openSql.queryHelper,
    {
        AUTO_INCREMENT
    } = openSql.keywordHelper;


module.exports = {


    groups() {

        openSql.createTable({
            table: `groups`,
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                img: VARCHAR(130),
                name: VARCHAR(70),
                inviteLink: VARCHAR(100),
                publicLink: VARCHAR(100),
                description: VARCHAR(255),
                defaultColor: VARCHAR(7)
            },
            primaryKey: 'id'
        });

    },


    groupsUsers() {

        openSql.createTable({
            table: 'groupsUsers',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                groupId: INT()
            },
            primaryKey: 'id',
        });

    },


    groupsAdmins() {

        openSql.createTable({
            table: 'groupsAdmins',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                adminId: INT(),
                groupId: INT(),
                isOwner: BOOLEAN()
            },
            primaryKey: 'id',
        });

    },


    groupContents(groupId) {

        openSql.createTable({
            table: '`' + groupId + 'GroupContents`',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                text: VARCHAR(4096),
                date: DATETIME(),
                type: ENUM(['None', 'Image', 'Location', 'Document', 'Video', 'Voice']),
                isReply: BOOLEAN(),
                fileUrl: VARCHAR(130),
                senderId: INT(),
                fileName: VARCHAR(15),
                fileSize: VARCHAR(15),
                location: POINT([NULL]),
                isForward: BOOLEAN(),
                targetReplyId: INT(),
                forwardDataId: INT()
            },
            primaryKey: 'id'
        });

    }


}