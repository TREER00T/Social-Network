const {
    OR,
    AND
} = require('app/database/util/SqlKeyword');

const LIKE = 'LIKE',
    NULL = 'NULL',
    EQUAL_TO = '=',
    LESS_THAN = '<',
    GREATER_THAN = '>',
    NOT_EQUAL_TO = '<>',
    BETWEEN = 'BETWEEN',
    NOT_NULL = 'NOT NULL',
    LESS_THAN_OR_EQUAL_TO = '<=',
    GREATER_THAN_OR_EQUAL_TO = '>=';

let saveStateOfArray,
    arrayOfOperator = [
        OR,
        AND,
        LIKE,
        NULL,
        BETWEEN,
        NOT_NULL,
        EQUAL_TO,
        LESS_THAN,
        NOT_EQUAL_TO,
        GREATER_THAN,
        LESS_THAN_OR_EQUAL_TO,
        GREATER_THAN_OR_EQUAL_TO
    ];


function getKeyAndValue(jsonObject, type) {
    let data;
    for (let key in jsonObject)
        data = {
            key: key,
            value: jsonObject[key]
        };

    return `${type} ` + data['key'] + ' ' + data['value'];
}


function validateOperator(jsonObject, operator, type) {
    let arrayOfKeyAndValue = (getKeyAndValue(jsonObject, type) + ' NOT_OP').split(' ');
    let arrayOfKeyAndValueWithLastOperator = getKeyAndValue(jsonObject, type).split(' ');


    if (operator !== undefined && !Array.isArray(operator)) {
        saveStateOfArray = arrayOfKeyAndValueWithLastOperator;
        saveStateOfArray = saveStateOfArray.concat(operator).toString().split(',');
    }

    if (operator !== undefined && Array.isArray(operator)) {
        saveStateOfArray = arrayOfKeyAndValueWithLastOperator;
        saveStateOfArray = saveStateOfArray.concat(operator).toString().split(',');
    }

    if (operator === undefined) {
        saveStateOfArray = arrayOfKeyAndValue;
        saveStateOfArray = saveStateOfArray.concat(operator).toString().split(',');
    }

    return saveStateOfArray.filter(v => v);
}


module.exports = {


    LIKE:LIKE,
    NULL:NULL,
    EQUAL_TO:EQUAL_TO,
    LESS_THAN:LESS_THAN,
    GREATER_THAN:GREATER_THAN,
    NOT_EQUAL_TO:NOT_EQUAL_TO,
    BETWEEN:BETWEEN,
    NOT_NULL:NOT_NULL,
    LESS_THAN_OR_EQUAL_TO:LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN_OR_EQUAL_TO:GREATER_THAN_OR_EQUAL_TO,


    getOperatorAndValue(operator, value) {
        let itemInArrayOfOperator = arrayOfOperator.includes(operator);

        if (!itemInArrayOfOperator)
            throw  new Error('Invalid data type');

        return `${operator}SPACE${value}`;

    },

    OR(jsonObject, operator) {
        return validateOperator(jsonObject, operator, OR);
    },


    AND(jsonObject, operator) {
        return validateOperator(jsonObject, operator, AND);
    }

}