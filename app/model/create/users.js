let openSql = require('app/database/OpenSql'),
    {
        INT,
        ENUM,
        BOOLEAN,
        VARCHAR,
        DATETIME
    } = require('app/database/util/DataType'),
    {
        NOT_NULL,
        AUTO_INCREMENT
    } = require('app/database/util/SqlKeyword');


module.exports = {

    users() {

        openSql.createTable({
            table: 'users',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                img: VARCHAR(130),
                bio: VARCHAR(70),
                email: VARCHAR(255),
                phone: VARCHAR(20),
                apiKey: VARCHAR(255),
                isActive: BOOLEAN(),
                authCode: INT(6),
                username: VARCHAR(32),
                password: VARCHAR(255),
                lastName: VARCHAR(20),
                firstName: VARCHAR(20),
                isBlocked: BOOLEAN()
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
            table: '`' + phone + 'SavedMessages`',
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
                locationId: INT(),
                isForward: BOOLEAN(),
                isUploading: BOOLEAN(),
                targetReplyId: INT(),
                forwardDataId: INT()
            },
            primaryKey: 'id',
            index: phone + 'SavedMessages(`text`)'
        });

    },


    devices() {

        openSql.createTable({
            table: `devices`,
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
            table: `userBlockList`,
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                userTargetId: INT()
            },
            primaryKey: 'id'
        });

    },


    e2eContents(e2eId) {

        openSql.createTable({
            table: '`' + e2eId + 'E2EContents`',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                date: DATETIME(),
                text: VARCHAR(4096),
                type: ENUM(['None', 'Image', 'Location', 'Document', 'Video', 'Voice']),
                isReply: BOOLEAN(),
                fileUrl: VARCHAR(130),
                senderId: INT(),
                fileSize: VARCHAR(15),
                fileName: VARCHAR(15),
                locationId: INT(),
                isForward: BOOLEAN(),
                isUploading: BOOLEAN(),
                targetReplyId: INT(),
                forwardDataId: INT()
            },
            primaryKey: 'id',
            index: e2eId + 'E2EContents(`text`)'
        });

    }

}