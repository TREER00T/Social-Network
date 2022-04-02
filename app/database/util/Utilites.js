const {
    IN,
    OR,
    AND,
    ASC,
    LIKE,
    DESC,
    NULL,
    COMMA,
    WHERE,
    LIMIT,
    OFFSET,
    NOT_IN,
    BETWEEN,
    ORDER_BY,
    EQUAL_TO,
    LESS_THAN,
    NOT_BETWEEN,
    GREATER_THAN,
    NOT_EQUAL_TO,
    QUESTION_MARK,
    DOUBLE_QUESTION_MARK,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN_OR_EQUAL_TO
} = require('./SqlKeyword');


let stringOFQuestionMarkAndEqual;
const OPERATOR_IN = 'IN',
    OPERATOR_NOT_IN = 'NOT IN';


/**
 * Valid params for optionKeyword
 * @param {ASC}
 * @param {DESC}
 * @param {LIMIT}
 * @param {OFFSET}
 * @param {ORDER_BY}
 */
let arrayOfValidOptionKeyword = [
    ASC,
    DESC,
    LIMIT,
    OFFSET,
    ORDER_BY
];


/**
 * Operator for where condition
 * @param {IN}
 * @param {OR}
 * @param {AND}
 * @param {LIKE}
 * @param {NOT_IN}
 * @param {BETWEEN}
 * @param {EQUAL_TO}
 * @param {LESS_THAN}
 * @param {NOT_BETWEEN}
 * @param {GREATER_THAN}
 * @param {NOT_EQUAL_TO}
 * @param {LESS_THAN_OR_EQUAL_TO}
 * @param {GREATER_THAN_OR_EQUAL_TO}
 * */
let arrayOfOperatorForWhereCondition = [
    IN,
    OR,
    AND,
    NULL,
    LIKE,
    NOT_IN,
    BETWEEN,
    EQUAL_TO,
    LESS_THAN,
    NOT_BETWEEN,
    GREATER_THAN,
    NOT_EQUAL_TO,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN_OR_EQUAL_TO
];


/**
 * valid question mark for sql keyword
 * @param {OR}
 * @param {AND}
 * @param {LIKE}
 * @param {LIMIT}
 * @param {OFFSET}
 * @param {BETWEEN}
 * @param {ORDER_BY}
 * @param {EQUAL_TO}
 * @param {LESS_THAN}
 * @param {NOT_BETWEEN}
 * @param {GREATER_THAN}
 * @param {NOT_EQUAL_TO}
 * @param {LESS_THAN_OR_EQUAL_TO}
 * @param {GREATER_THAN_OR_EQUAL_TO}
 * */
let arrayOfQuestionMark = [
    OR,
    AND,
    LIKE,
    NULL,
    LIMIT,
    OFFSET,
    BETWEEN,
    ORDER_BY,
    EQUAL_TO,
    LESS_THAN,
    NOT_BETWEEN,
    GREATER_THAN,
    NOT_EQUAL_TO,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN_OR_EQUAL_TO
];

function generateDoubleQuestionMarksEqualQuestionMark(sizeOfKey) {
    let mergeQuestionMarksWithEqual = '';

    let initPlaceHolder = `${DOUBLE_QUESTION_MARK} ${EQUAL_TO} ${QUESTION_MARK}`;

    for (let i = 0; i < sizeOfKey; i++) {
        let isLastNumber = (i === sizeOfKey - 1);

        if (isLastNumber) {
            mergeQuestionMarksWithEqual += `${initPlaceHolder} `;
            continue;
        }

        if (i === 0 || i !== 0)
            mergeQuestionMarksWithEqual += `${initPlaceHolder} ${COMMA} `;

    }

    return stringOFQuestionMarkAndEqual = mergeQuestionMarksWithEqual;
}


function generateArrayOfKeyAndValueForSqlQuery(jsonObject) {
    let arrayOfKeyAndValue = [],
        index = 0,
        size = 0;
    for (let key in jsonObject.editField) {
        let value = jsonObject.editField[key];
        arrayOfKeyAndValue.push(`${key}`);
        index++;
        size++;
        arrayOfKeyAndValue[index++] = `${value}`;
    }
    arrayOfKeyAndValue.unshift(`${jsonObject.table}`);
    generateDoubleQuestionMarksEqualQuestionMark(size);
    return arrayOfKeyAndValue;
}


function addDataTypeForFieldInFirstItemOfArray(type, arrayOfStateField) {
    let firstIndexOldArray = arrayOfStateField[0];

    if (Number.isInteger(firstIndexOldArray)) {
        arrayOfStateField.splice(arrayOfStateField.indexOf(firstIndexOldArray), 1);
        arrayOfStateField.unshift(`${type}(${firstIndexOldArray}) `);
    }

    let firstIndexNewArray = arrayOfStateField[0];
    let isDataTypeInNewArray = firstIndexNewArray.includes(type);

    if (!isDataTypeInNewArray) {
        arrayOfStateField.unshift(`${type}`);
    }

    return arrayOfStateField;
}


function getSqlDataType(arrayOfStateField) {
    let newArrayOfStateField = [];

    for (let index in arrayOfStateField) {
        let item = arrayOfStateField[index];

        newArrayOfStateField.push(`${item} `);
    }

    return newArrayOfStateField.join('');
}

function splitValueInString(str) {
    return str.split(' ')[1];
}

function splitOperatorInString(str) {
    return str.split(' ')[0];
}

function removeUnderscoreInString(str) {
    return str.replaceAll('_', ' ').toUpperCase();
}

let arrayOfOperatorDoubleQuestionMarkEqualQuestionMarkInUpdateSqlQuery = [
    OR,
    AND
];

let arrayOfOperatorDoseNotHaveQuestionMark = [
    OPERATOR_IN,
    OPERATOR_NOT_IN
];

let arrayOfOperatorOneQuestionMarkInUpdateSqlQuery = [
    LIKE,
    BETWEEN,
    NOT_BETWEEN
];

let arrayOfValidOperatorForUpdateSqlQuery = [
    OR,
    AND,
    LIKE,
    BETWEEN,
    NOT_BETWEEN,
    OPERATOR_IN,
    OPERATOR_NOT_IN
];


//  ${QUESTION_MARK}  AND and between fix this bug check before index of array arrayOfEqualAndQuestionMarks if it use and ?? = ? else use ?

function checkOtherConditionInWhereObject(jsonObject) {
    let index = 0,
        arrayOfEqualAndQuestionMarks = [],
        initPlaceHolder = `${DOUBLE_QUESTION_MARK} ${EQUAL_TO} ${QUESTION_MARK}`;

    for (let key in jsonObject) {
        let value = jsonObject[key];
        let firstIndex = (index === 0);
        let keyword = removeUnderscoreInString(key);
        let isOperatorForUpdateSqlQueryInArray = arrayOfValidOperatorForUpdateSqlQuery.includes(keyword);
        let isOperatorDoseNotHaveQuestionMark = arrayOfOperatorDoseNotHaveQuestionMark.includes(keyword);
        let isOperatorHaveOneQuestionMark = arrayOfOperatorOneQuestionMarkInUpdateSqlQuery.includes(keyword);
        let isOperatorHaveDoubleQuestionMark = arrayOfOperatorDoubleQuestionMarkEqualQuestionMarkInUpdateSqlQuery.includes(keyword);

        if (key === BETWEEN)
            console.log(arrayOfEqualAndQuestionMarks)


        if (isOperatorDoseNotHaveQuestionMark) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} (?) `);
            index++;
            continue;
        }


        if (!isOperatorForUpdateSqlQueryInArray && firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${EQUAL_TO} ${QUESTION_MARK} `);
            index++;
            continue;
        }


        if (isOperatorForUpdateSqlQueryInArray) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} `);
            index++;
            continue;
        }


        if (!isOperatorForUpdateSqlQueryInArray) {
            arrayOfEqualAndQuestionMarks.push(`${COMMA} ${initPlaceHolder} `);
            console.log(key)
            index++;
        }


        if (isOperatorHaveOneQuestionMark) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} ${initPlaceHolder} `);
            index++;
        }

        if (!isOperatorHaveOneQuestionMark && firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${EQUAL_TO} ${QUESTION_MARK} ${keyword} ${QUESTION_MARK} `);
            index++;
        }



    }
    console.log(arrayOfEqualAndQuestionMarks)
}


module.exports = {


    sqlQuery: '',


    getOptionKeywordSqlQuery(jsonArray) {
        let newArrayOfKeywordsWithSqlContext = [],
            isUsedWhereCondition = false;

        if (jsonArray.optionKeyword === undefined)
            return module.exports.sqlQuery = '';

        jsonArray.optionKeyword.forEach((item, index, arrayOfKeyword) => {

            let nextKeyword = arrayOfKeyword[index + 1];
            let isSetLimit = (jsonArray.limit !== false);
            let isSetWhereCondition = (jsonArray.where !== false);
            let isValidOptionKeyword = arrayOfValidOptionKeyword.includes(item);
            let isValidQuestionMarkForKeyword = arrayOfQuestionMark.includes(item);
            let isValidOperatorForWhereCondition = arrayOfOperatorForWhereCondition.includes(item);


            if (!isValidOptionKeyword && !isValidOperatorForWhereCondition)
                throw new Error('Invalid Option Keyword Params');


            if (isValidQuestionMarkForKeyword)
                newArrayOfKeywordsWithSqlContext.push(` ${item} ${QUESTION_MARK} `);


            if (!isValidQuestionMarkForKeyword)
                newArrayOfKeywordsWithSqlContext.push(` ${item} `);


            if (item === ASC && nextKeyword === DESC || item === DESC && nextKeyword === ASC)
                newArrayOfKeywordsWithSqlContext.push(` ${item} ${COMMA} ${QUESTION_MARK} `);


            if (isSetLimit && item === LIMIT)
                newArrayOfKeywordsWithSqlContext.push(` ${item} ${QUESTION_MARK} ${COMMA} ${QUESTION_MARK} `);


            if (isSetWhereCondition && isValidOperatorForWhereCondition && nextKeyword === AND ||
                nextKeyword === OR || isValidQuestionMarkForKeyword)
                isUsedWhereCondition = true;

        });

        module.exports.sqlQuery = newArrayOfKeywordsWithSqlContext.join("");

        if (isUsedWhereCondition)
            return module.exports.sqlQuery = ` ${WHERE} ${DOUBLE_QUESTION_MARK}` +
                ` ${newArrayOfKeywordsWithSqlContext.join("")} `;


        return module.exports.sqlQuery;
    },


    getCreateTableSqlQuery(jsonArray) {
        let newArrayOfFieldItem = [];

        for (let value in jsonArray.field) {
            let key = jsonArray.field[value];

            newArrayOfFieldItem.push(`${value} ${key}${COMMA} `);
        }

        module.exports.sqlQuery = newArrayOfFieldItem.join('')
            .replace(/,\s*$/, ''); // replace last comma in array

        if (jsonArray.primaryKey !== undefined)
            return module.exports.sqlQuery += `${COMMA} ${jsonArray.primaryKey}`;


        return module.exports.sqlQuery;
    },


    getError(err) {
        return (err !== undefined) ? err : 'Default OpenSql Error';
    },

    generateUpdateSqlQuery(jsonObject) {

        generateArrayOfKeyAndValueForSqlQuery(jsonObject);

        checkOtherConditionInWhereObject(jsonObject.where);

        // DOUBLE_QUESTION_MARK
        // module.exports.sqlQuery
    }


}