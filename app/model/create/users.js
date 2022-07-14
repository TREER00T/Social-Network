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
        AUTO_INCREMENT
    } = openSql.keywordHelper,
    {
        NOT_NULL
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('app/exception/DataBaseException'),
    {
        NULL
    } = require('opensql/src/util/QueryHelper');


module.exports = {

    users() {

        openSql.createTable({
            table: 'users',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                img: VARCHAR(130),
                bio: VARCHAR(70),
                name: VARCHAR(20),
                email: VARCHAR(255),
                phone: VARCHAR(20),
                apiKey: VARCHAR(255),
                isActive: BOOLEAN(),
                authCode: INT(6),
                username: VARCHAR(32),
                password: VARCHAR(255),
                lastName: VARCHAR(20),
                isBlocked: BOOLEAN(),
                defaultColor: VARCHAR(7)
            },
            primaryKey: 'id'
        });


    },


    listOfUserGroups() {

        openSql.createTable({
            table: 'listOfUserGroups',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                groupId: INT()
            },
            primaryKey: 'id'
        });

    },


    listOfUserE2Es() {

        openSql.createTable({
            table: 'listOfUserE2Es',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                toUser: INT(),
                fromUser: INT(),
                userId: INT(),
                tblChatId: VARCHAR(100)
            },
            primaryKey: 'id'
        });

    },


    listOfUserChannels() {

        openSql.createTable({
            table: 'listOfUserChannels',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                channelId: INT()
            },
            primaryKey: 'id'
        });

    },


    savedMessages(phone) {

        openSql.createTable({
            table: phone + 'SavedMessages',
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

    },


    devices() {

        openSql.createTable({
            table: 'devices',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                deviceIp: VARCHAR(15),
                createdAt: DATETIME(),
                deviceName: VARCHAR(50),
                deviceLocation: VARCHAR(50)
            },
            primaryKey: 'id'
        });

    },


    userBlockList() {

        openSql.createTable({
            table: 'userBlockList',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                userTargetId: INT()
            },
            primaryKey: 'id'
        });

    },


    e2eContents(fromUser, toUser, cb) {

        openSql.createTable({
            table: fromUser + 'And' + toUser + 'E2EContents',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                text: VARCHAR(4096),
                date: DATETIME(),
                type: ENUM(['None', 'Image', 'Location', 'Document', 'Video', 'Voice']),
                isReply: BOOLEAN(),
                fileUrl: VARCHAR(130),
                senderId: INT(),
                fileSize: VARCHAR(15),
                fileName: VARCHAR(15),
                location: POINT([NULL]),
                isForward: BOOLEAN(),
                targetReplyId: INT(),
                forwardDataId: INT()
            },
            primaryKey: 'id'
        }).result(result => {
            try {
                (result[1].warningCount > 0 && result[1].warningCount !== undefined) ? cb(false) : cb(true);
            } catch (e) {
                DataBaseException(e);
            }
        });

    }

}