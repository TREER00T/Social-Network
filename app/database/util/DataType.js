const {
        addDataTypeForFieldInFirstItemOfArray
    } = require('./Utilites');

let int = 'int',
    Enum = 'enum',
    char = 'char',  // 0 - 255
    date = 'date',  // 2022-03-20
    time = 'time',  // 23:55:54
    point = 'point',
    boolean = 'boolean',
    varchar = 'varchar',
    datetime = 'datetime';  // 2022-03-20 20:32:42

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

    DATETIME(data) {
        return addDataTypeForFieldInFirstItemOfArray(datetime, data);
    },

    ENUM(data) {
        return addDataTypeForFieldInFirstItemOfArray(Enum, data);
    },

    BOOLEAN(data) {
        return addDataTypeForFieldInFirstItemOfArray(boolean, data);
    },

    POINT(data) {
        return addDataTypeForFieldInFirstItemOfArray(point, data);
    }

}