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
    NOT_NULL,
    LESS_THAN,
    GREATER_THAN,
    NOT_EQUAL_TO,
    QUESTION_MARK,
    AUTO_INCREMENT,
    DOUBLE_QUESTION_MARK,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN_OR_EQUAL_TO
} = require('./SqlKeyword');


let stringOfQuestionMarkAndEqual,
    arrayOfKeyAndValueDataForQuery = [];
const OPERATOR_IN = 'IN';


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

    return stringOfQuestionMarkAndEqual = mergeQuestionMarksWithEqual;
}


function generateArrayOfKeyAndValueForEditField(jsonObject) {
    let arrayOfKeyAndValue = [],
        index = 0,
        size = 0;
    for (let key in jsonObject.editField) {
        let value = jsonObject.editField[key];
        arrayOfKeyAndValueDataForQuery.push(key);
        arrayOfKeyAndValueDataForQuery.push(value.toString());
        arrayOfKeyAndValue.push(`${key}`);
        index++;
        size++;
        arrayOfKeyAndValue[index++] = `${value}`;
    }
    generateDoubleQuestionMarksEqualQuestionMark(size);
    return arrayOfKeyAndValue;
}


function splitValueInString(str) {
    return str.split(' ')[1];
}

function splitOperatorInString(str) {
    return str.split(' ')[0];
}

function splitDataFormOperatorInAndPutOnArray(str) {
    let newArray;
    newArray = str.split(' ');
    newArray.splice(0, 1);
    newArray.slice();
    return newArray;
}

function removeUnderscoreInString(str) {
    return str.replaceAll('_', ' ').toUpperCase();
}

function splitValueFromString(str) {
    return str.split(' ')[1];
}

function splitColumnNameFromString(str) {
    return str.split(' ')[0];
}

function removeSpaceWordInString(str) {
    return str.replace('SPACE', ' ');
}

let arrayOfValidOperatorQuery = [
    OR,
    AND,
    LIKE,
    BETWEEN,
    OPERATOR_IN
];


function getStringOfEnumTypesWithComma(arrayOfEnumTypes) {
    let stringOfEnumTypesWithComma = '';
    arrayOfEnumTypes.forEach((item, index, arr) => {

        let lastIndex = arr.lastIndexOf(item);

        if (lastIndex) {
            stringOfEnumTypesWithComma += `${COMMA} '${item}'`;
        }

        if (!lastIndex) {
            stringOfEnumTypesWithComma += `'${item}'`;
        }

    });
    return stringOfEnumTypesWithComma;
}


function getQueryAndCheckOtherConditionInWhereObject(jsonObject) {
    let index = 0,
        isKeywordBetweenUsed = false,
        arrayOfEqualAndQuestionMarks = [];

    for (let key in jsonObject) {
        let value = jsonObject[key];
        let firstIndex = (index === 0);
        let isOperatorBetween = (key === BETWEEN);
        let isCharacter = (key.length === 1);
        let isOperatorLike = (key === LIKE);
        let keyword = removeUnderscoreInString(key);
        let isOperatorAnd = (keyword === AND);
        let checkSpaceWordInString = value.toString().search('SPACE') > -1;

        let newValue = (checkSpaceWordInString) ? splitValueInString(removeSpaceWordInString(value)) :
            splitValueInString(`${EQUAL_TO} ${value}`);

        let isOperatorIn = (OPERATOR_IN === keyword);
        let isValidOperatorForUpdateSqlQueryInArray = arrayOfValidOperatorQuery.includes(keyword);


        if (!isCharacter && !isValidOperatorForUpdateSqlQueryInArray) {
            arrayOfKeyAndValueDataForQuery.push(key);
            arrayOfKeyAndValueDataForQuery.push(`${newValue}`);
        }


        if (isOperatorIn && firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} (?) `);
            arrayOfKeyAndValueDataForQuery.push(splitColumnNameFromString(value));
            arrayOfKeyAndValueDataForQuery.push(splitDataFormOperatorInAndPutOnArray(value));
            index++;
        }


        if (isOperatorIn && !firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${DOUBLE_QUESTION_MARK} ${keyword} (?) `);
            arrayOfKeyAndValueDataForQuery.push(splitColumnNameFromString(value));
            arrayOfKeyAndValueDataForQuery.push(splitDataFormOperatorInAndPutOnArray(value));
            index++;
        }

        if (isOperatorLike || isOperatorBetween) {
            arrayOfKeyAndValueDataForQuery.push(splitColumnNameFromString(value));
            arrayOfKeyAndValueDataForQuery.push(splitValueFromString(value));
        }

        if (isOperatorAnd)
            arrayOfKeyAndValueDataForQuery.push(`${value}`);


        if (isOperatorBetween && !firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${DOUBLE_QUESTION_MARK} ${keyword} ${QUESTION_MARK} `);
            isKeywordBetweenUsed = true;
            index++;
        }

        if (isOperatorBetween && firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} ${QUESTION_MARK} `);
            isKeywordBetweenUsed = true;
            index++;
        }

        if (isOperatorAnd && isKeywordBetweenUsed) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} ${QUESTION_MARK} `);
            isKeywordBetweenUsed = false;
            index++;
        }


        if (isOperatorLike && !firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${DOUBLE_QUESTION_MARK} ${keyword} ${QUESTION_MARK} `);
            index++;
        }

        if (isOperatorLike && firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} ${QUESTION_MARK} `);
            index++;
        }


        if (isValidOperatorForUpdateSqlQueryInArray) {
            index++;
            continue;
        }


        let operator = (checkSpaceWordInString) ? splitOperatorInString(removeSpaceWordInString(value)) :
            splitOperatorInString(`${EQUAL_TO} ${value}`);


        let initPlaceHolder = `${DOUBLE_QUESTION_MARK} ${operator} ${QUESTION_MARK}`;

        if (firstIndex && !isCharacter) {
            arrayOfEqualAndQuestionMarks.push(`${operator} ${QUESTION_MARK} `);
            index++;
        }

        if (!firstIndex && isCharacter) {
            arrayOfEqualAndQuestionMarks.push(`${value}`);
            index++;
        }

        if (!firstIndex && !isCharacter) {
            arrayOfEqualAndQuestionMarks.push(`${initPlaceHolder} `);
            index++;
        }


    }
    return arrayOfEqualAndQuestionMarks.join(' ');
}


module.exports = {


    sqlQuery: '',
    stringOfDataForForSet: '',
    dataForInsertSqlQuery: [],
    arrayOfDataForUpdateOrDeleteQuery: '',
    stringOfDoubleQuestionMarkAndComma: '',


    addDataTypeForFieldInFirstItemOfArray(type, data) {

        if (data === undefined)
            return type;

        let stringDataTypeField = '',
            isArray = Array.isArray(data),
            isValidType = false;

        if (Number.isInteger(data))
            stringDataTypeField = `${type}(${data}) `;

        if (isArray) {

            data.forEach((item) => {

                let arrayOfValidTypeOption = [
                    AUTO_INCREMENT,
                    NOT_NULL
                ];

                let isInArray = arrayOfValidTypeOption.includes(item);
                if (isInArray)
                    isValidType = type;

            })
        }

        if (isArray && isValidType)
            stringDataTypeField = `${type} ${data.join(' ')} `;

        if (isArray && !isValidType)
            stringDataTypeField = `${type}(${getStringOfEnumTypesWithComma(data)}) `;

        return stringDataTypeField;
    },


    generateDoubleQuestionMarkAndComma(jsonArray) {

        let newStringOfDoubleQuestionMarkAndComma = '';

        for (let keys = Object.keys(jsonArray), i = 0, end = keys.length; i < end; i++) {

            let key = keys[i], value = jsonArray[key];


            if (typeof value === 'object') {

                let array2D = [];
                value.forEach((item) => {
                    array2D.push([item]);
                });

                module.exports.dataForInsertSqlQuery[i] = array2D;
            }


            if (end !== (i + 1))
                newStringOfDoubleQuestionMarkAndComma += `${key} ${COMMA} `;

            if (end === (i + 1))
                newStringOfDoubleQuestionMarkAndComma += key;

        }

        return newStringOfDoubleQuestionMarkAndComma;

    },


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
            return module.exports.sqlQuery += `${COMMA} PRIMARY KEY (${jsonArray.primaryKey})`;

        if (jsonArray.index !== undefined)
            return module.exports.sqlQuery += `${COMMA} INDEX ${jsonArray.index}`;


        return module.exports.sqlQuery;
    },


    getError(err) {
        return (err !== undefined) ? err : 'Default OpenSql Error';
    },


    generateUpdateSqlQueryWithData(jsonObject) {

        generateArrayOfKeyAndValueForEditField(jsonObject);

        module.exports.sqlQuery = getQueryAndCheckOtherConditionInWhereObject(jsonObject.where);

        module.exports.stringOfDataForForSet = stringOfQuestionMarkAndEqual;

        arrayOfKeyAndValueDataForQuery.unshift(jsonObject.table);

        module.exports.arrayOfDataForUpdateOrDeleteQuery = arrayOfKeyAndValueDataForQuery;

        arrayOfKeyAndValueDataForQuery = [];
    },


    generateDeleteSqlQueryWithData(jsonObject) {

        module.exports.sqlQuery = getQueryAndCheckOtherConditionInWhereObject(jsonObject.where);

        arrayOfKeyAndValueDataForQuery.unshift(jsonObject.table);

        module.exports.arrayOfDataForUpdateOrDeleteQuery = arrayOfKeyAndValueDataForQuery;

        arrayOfKeyAndValueDataForQuery = [];
        module.exports.sqlQuery = '';
    },


    getStringOfColumnWithComma(data) {
        let newData = data;
        return (data !== Array) ? newData : data.forEach((item, index, arrayOfColumns) => {
            let isLastIndex = arrayOfColumns[arrayOfColumns.length - 1];
            if (!isLastIndex)
                newData += `${item} ${COMMA}`;
            if (isLastIndex)
                newData += item;
        });
    },


    removeSqlQuery() {
        return module.exports.sqlQuery = '';
    },


    removeStringOfDataForForSet() {
        return module.exports.stringOfDataForForSet = '';
    }


}
