const {
        int,
        char,
        date,
        time,
        varchar,
        boolean,
        datetime
    } = require('./SqlKeyword'),
    {
        getSqlDataType,
        addDataTypeForFieldInFirstItemOfArray
    } = require('./Utilites');


module.exports = {

    VARCHAR(arrayOfStateField) {
        return getSqlDataType(addDataTypeForFieldInFirstItemOfArray(varchar, arrayOfStateField));
    },

    INT(arrayOfStateField) {
        return getSqlDataType(addDataTypeForFieldInFirstItemOfArray(int, arrayOfStateField));
    },

    CHAR(arrayOfStateField) {
        return getSqlDataType(addDataTypeForFieldInFirstItemOfArray(char, arrayOfStateField));
    },


    DATE(arrayOfStateField) {
        return getSqlDataType(addDataTypeForFieldInFirstItemOfArray(date, arrayOfStateField));
    },


    TIME(arrayOfStateField) {
        return getSqlDataType(addDataTypeForFieldInFirstItemOfArray(time, arrayOfStateField));
    },

    BOOLEAN(arrayOfStateField) {
        return getSqlDataType(addDataTypeForFieldInFirstItemOfArray(boolean, arrayOfStateField));
    },

    DATETIME(arrayOfStateField) {
        return getSqlDataType(addDataTypeForFieldInFirstItemOfArray(datetime, arrayOfStateField));
    }

}