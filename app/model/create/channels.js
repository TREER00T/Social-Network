let openSql = require('app/database/OpenSql'),
    {
        INT,
        BIT,
        ENUM,
        VARCHAR,
        DATETIME
    } = require('app/database/util/DataType'),
    {
        NOT_NULL,
        AUTO_INCREMENT
    } = require('app/database/util/SqlKeyword');


module.exports = {

    reportChannels() {

        openSql.createTable({
            table: 'reportChannels',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                note: VARCHAR(255),
                type: ENUM(['Spam', 'Fake Account', 'Violence', 'Child Abuse', 'Illegal Drugs', 'Personal Details', 'Pornography', 'Other']),
                userId: INT(),
                status: ENUM(['accept', 'pending', 'decline']),
                channelId: INT(),
                acceptAt: VARCHAR(16)
            },
            primaryKey: 'id'
        })

    },


    channelContents(channelId) {

        openSql.createTable({
            table: '`' + channelId + 'ChannelContents`',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                text: VARCHAR(4096),
                date: DATETIME(),
                type: ENUM(['Image', 'Location', 'Document', 'Video', 'Voice']),
                isReply: BIT(),
                fileUrl: VARCHAR(130),
                fileName: VARCHAR(15),
                fileSize: VARCHAR(10),
                isForward: BIT(),
                targetReplyId: INT(),
                forwardDataId: INT()
            },
            primaryKey: 'id',
            index: channelId + 'ChannelContents(`text`)'
        })

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
        })

    },


    channels() {

        openSql.createTable({
            table: `channels`,
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                img: VARCHAR(130),
                name: VARCHAR(70),
                inviteLink: VARCHAR(100),
                publicLink: VARCHAR(100),
                description: VARCHAR(255)
            },
            primaryKey: 'id',
            index: 'Channels_Name(`name`)'
        })

    },


    channelsAdmins() {

        openSql.createTable({
            table: 'channelsAdmins',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                adminId: INT(),
                isOwner: BIT(),
                channelId: INT()
            },
            primaryKey: 'id',
        })

    }


}