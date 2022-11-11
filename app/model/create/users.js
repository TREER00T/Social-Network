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
        isUndefined
    } = require('../../util/Util'),
    {
        AUTO_INCREMENT
    } = openSql.keywordHelper,
    {
        NULL,
        NOT_NULL
    } = openSql.queryHelper,
    {
        DataBaseException
    } = require('../../exception/DataBaseException');


module.exports = {

    async users() {

        await openSql.createTable({
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


    async listOfUserGroups() {

        await openSql.createTable({
            table: 'listOfUserGroups',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                groupId: INT()
            },
            primaryKey: 'id'
        });

    },


    async listOfUserE2Es() {

        await openSql.createTable({
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


    async listOfUserChannels() {

        await openSql.createTable({
            table: 'listOfUserChannels',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                channelId: INT()
            },
            primaryKey: 'id'
        });

    },


    async savedMessages(phone) {

        await openSql.createTable({
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


    async devices() {

        await openSql.createTable({
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


    async userBlockList() {

        await openSql.createTable({
            table: 'userBlockList',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                userTargetId: INT()
            },
            primaryKey: 'id'
        });

    },


    async e2eContents(fromUser, toUser) {

        return new Promise(res => {

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
                    res(isUndefined(result[1]?.warningCount));
                } catch (e) {
                    DataBaseException(e);
                }
            });

        });


    }

}