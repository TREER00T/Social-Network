require('app-module-path').addPath(__dirname);
// require('app/io/connect/socket');
// let Router = require('app/middleware/RouterInterface');
//
//
// Router.initialization();

const {getOperatorAndValue} = require("app/database/util/FieldUtilities");
const {update} = require("app/database/OpenSql");
const {OR, AND} = require("app/database/util/QueryUtilities");


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
                    phone: '09030207892',
                }, AND({
                    admin: true
                }))
            ]
        }
    }
)

// where isblock =  true and (phoneNumber = 045555 or phoneNumberd = 09030207892) or (phoneNumber = 045555 and phoneNumberd = 09030207892)
// in , betwwen , other

// {
//     table: 'users',
//         editField: {
//     verificationCode: 122875,
//         username: 'ali'
// },
//     where: {
//         phoneNumber: '045555',
//             a: 'AND',
//             phoneNumberd: '09030207892',
//             phoneNumberddd: '09',
//             NOT_IN: 'id 0 5 7',
//             BETWEEN: 57,
//             AND: 58,
//             b: 'AND',
//             LIKE: 12
//     }
// }