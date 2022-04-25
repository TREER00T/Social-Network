const {
        int,
        bit,
        char,
        date,
        Enum,
        time,
        varchar,
        datetime
    } = require('./SqlKeyword'),
    {
        addDataTypeForFieldInFirstItemOfArray
    } = require('./Utilites');


module.exports = {

    VARCHAR(data) {
        return addDataTypeForFieldInFirstItemOfArray(varchar, data);
    },

    INT(data) {
        return addDataTypeForFieldInFirstItemOfArray(int, data);
    },

    CHAR(data) {
        return addDataTypeForFieldInFirstItemOfArray(char, data);
    },

    DATE(data) {
        return addDataTypeForFieldInFirstItemOfArray(date, data);
    },

    TIME(data) {
        return addDataTypeForFieldInFirstItemOfArray(time, data);
    },

    BIT(data) {
        return addDataTypeForFieldInFirstItemOfArray(bit, data);
    },

    DATETIME(data) {
        return addDataTypeForFieldInFirstItemOfArray(datetime, data);
    },

    ENUM(data) {
        return addDataTypeForFieldInFirstItemOfArray(Enum, data);
    }

}