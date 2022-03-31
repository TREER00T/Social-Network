const {query} = require('../Util/DatabaseConnection');


module.exports = {
    createUsersTable: () => {
        query('CREATE TABLE users (phoneNumber varchar(11) NOT NULL, verificationCode varchar(6), bio varchar(75), username varchar(40), img varchar(400), PRIMARY KEY (phoneNumber) );', {}, (err, result) => {
        }, 'Table users already exists');
    },
    insertPhoneAndVerificationCode: (phoneNumber, verificationCode, callBack) => {
        query('INSERT INTO users SET ? ', {
            phoneNumber: phoneNumber,
            verificationCode: verificationCode
        }, (err, result) => {
            (result) ? callBack(true) : callBack(false);
        }, 'This user already exists');
    },
    checkVerificationCode: (phoneNumber, verificationCode, callBack) => {
        query('SELECT ?? FROM ?? WHERE phoneNumber = ? AND verificationCode = ? ', [['verificationCode', 'phoneNumber'], 'users', phoneNumber, verificationCode], (err, result) => {
            (result.length > 0) ? callBack(true) : callBack(false);
        }, 'The user phone number or verification code are false');
    },
    updateVerificationCode: (phoneNumber, verificationCode, callBack) => {
        query('UPDATE users SET verificationCode = ? WHERE phoneNumber = ? ', [12, '09030207892'], 'Cannot update column verificationCode')
    },
    deleteUserForUnitTest: (phoneNumber, callBack) => {
        query('DELETE FROM ?? WHERE phoneNumber = ?', [[phoneNumber], 'users'], (err, result) => {
            (result) ? callBack(true) : callBack(false);
        }, 'Can not delete user')
    }

}