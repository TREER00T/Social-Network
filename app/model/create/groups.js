let openSql = require('app/database/OpenSql'),
    {
        INT,
        BIT,
        ENUM,
        VARCHAR, DATETIME
    } = require('app/database/util/DataType'),
    {
        NOT_NULL,
        AUTO_INCREMENT
    } = require('app/database/util/SqlKeyword');


module.exports = {


    reportGroups() {

        openSql.createTable({
            table: 'reportGroups',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                note: VARCHAR(255),
                type: ENUM(['Spam', 'Fake Account', 'Violence', 'Child Abuse', 'Illegal Drugs', 'Personal Details', 'Pornography', 'Other']),
                status: ENUM(['accept', 'pending', 'decline']),
                userId: INT(),
                groupId: INT(),
                acceptAt: VARCHAR(16)
            },
            primaryKey: 'id'
        })

    },


    groups() {

        openSql.createTable({
            table: `groups`,
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                img: VARCHAR(130),
                name: VARCHAR(70),
                inviteLink: VARCHAR(100),
                publicLink: VARCHAR(100),
                description: VARCHAR(255)
            },
            primaryKey: 'id',
            index: 'Groups_Name(`name`)'
        })

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
        })

    },


    groupsAdmins() {

        openSql.createTable({
            table: 'groupsAdmins',
            field: {
                id: INT([NOT_NULL, AUTO_INCREMENT]),
                adminId: INT(),
                groupId: INT(),
                isOwner: BIT()
            },
            primaryKey: 'id',
        })

    },


    groupContents(groupId) {

        openSql.createTable({
            table: '`' + groupId + 'GroupContents`',
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
            index: groupId + 'GroupContents(`text`)'
        })

    }


}