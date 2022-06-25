require('app-module-path').addPath(__dirname);
// require('app/io/connect/socket');
// let Router = require('app/middleware/RouterInterface');
//
//
// Router.initialization();

const {getOperatorAndValue} = require("app/database/util/FieldHelper");
const keyHelper = require("app/database/util/KeywordHelper");
const {update} = require("app/database/OpenSql");
const {OR, IN, AND} = require("app/database/util/QueryHelper");


update(
    {
        table: 'users',
        editField: {
            verificationCode: 122875,
            username: 'ali'
        },
        where: {
            isblock: true,
            op: [
                OR({
                    phonde: '09030207892',
                }, AND({
                    admidn: true
                })),
                OR({
                    phondej: '055',
                }, AND({
                    admidhghn: false
                }))
            ],
            id: IN([0, 50])
        }
    }
)

// in , betwwen , other