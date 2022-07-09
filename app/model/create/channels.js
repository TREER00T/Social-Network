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
        NOT_NULL
    } = openSql.queryHelper,
    {
        AUTO_INCREMENT
    } = openSql.keywordHelper;


module.exports = {

    reportChannels() {

        openSql.createTable({
            table: 'reportChannels',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                note: VARCHAR(255),
                type: ENUM(['Spam', 'Fake Account', 'Violence', 'Child Abuse',
                    'Illegal Drugs', 'Personal Details', 'Pornography', 'Other']),
                userId: INT(),
                status: ENUM(['accept', 'pending', 'decline']),
                channelId: INT(),
                acceptAt: VARCHAR(16)
            },
            primaryKey: 'id'
        });

    },


    channelContents(channelId) {

        openSql.createTable({
            table:  channelId + 'ChannelContents',
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
                location: POINT(),
                isForward: BOOLEAN(),
                targetReplyId: INT(),
                forwardDataId: INT()
            },
            primaryKey: 'id'
        });

    },


    channelsUsers() {

        openSql.createTable({
            table: 'channelsUsers',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                userId: INT(),
                channelId: INT()
            },
            primaryKey: 'id',
        });

    },


    channels() {

        openSql.createTable({
            table: 'channels',
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


    channelsAdmins() {

        openSql.createTable({
            table: 'channelsAdmins',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                adminId: INT(),
                isOwner: BOOLEAN(),
                channelId: INT()
            },
            primaryKey: 'id',
        });

    }


}