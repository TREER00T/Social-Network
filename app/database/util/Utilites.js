const {
        IN,
        OR,
        AND,
        ASC,
        STAR,
        DESC,
        LIKE,
        COMMA,
        LIMIT,
        COUNT,
        OFFSET,
        BETWEEN,
        ORDER_BY,
        QUESTION_MARK,
        AUTO_INCREMENT,
        DOUBLE_QUESTION_MARK,
    } = require('app/database/util/KeywordHelper'),
    {
        WHERE,
        EQUAL_TO,
        NOT_NULL,
        LESS_THAN,
        IS_NOT_NULL,
        GREATER_THAN,
        NOT_EQUAL_TO,
        LESS_THAN_OR_EQUAL_TO,
        GREATER_THAN_OR_EQUAL_TO
    } = require('app/database/util/QueryHelper');


let stringOfQuestionMarkAndEqual,
    arrayOfKeyAndValueDataForQuery = [],
    fieldData;
const OPERATOR_IN = 'IN';


let arrayOfOperator = [
    EQUAL_TO,
    LESS_THAN,
    GREATER_THAN,
    NOT_EQUAL_TO,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN_OR_EQUAL_TO
];

let arrayOfValidOptionKeyword = [
    ASC,
    DESC,
    LIMIT,
    OFFSET,
    ORDER_BY
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


function splitValueOfSpaceKeywordInString(str) {
    return str.split(' ')[1];
}

function splitOperatorInString(str) {
    return str.split(' ')[0];
}

function arrayOfValueForInOperator(str) {
    return str.replace('in ', '').split(',');
}

function removeUnderscoreInString(str) {
    return str.replaceAll('_', ' ').toUpperCase();
}

function isInOperatorInString(str) {
    if (typeof str === 'string')
        return /in/.test(str);
}


function removeSpaceWordInString(str) {
    return str.replace('SPACE', ' ');
}

let arrayOfValidOperatorQuery = [
    OR.toLowerCase(),
    AND.toLowerCase(),
    LIKE.toLowerCase(),
    BETWEEN.toLowerCase(),
    OPERATOR_IN.toLowerCase()
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
        let value = jsonObject[key],
            arrayOfOperatorAndValue2d = jsonObject.op,
            isFirstIndex = (index === 0),
            isOperatorBetween = (value === 'between'),
            isDefinedArrayOfOperatorAndValue = Array.isArray(value),
            isOperatorLike = (key === 'like'),
            keyword = removeUnderscoreInString(key),
            isOperatorAnd = (keyword === 'and'),
            isSpaceWordInString = value.toString().search('SPACE') > -1,
            newValue = (isSpaceWordInString) ? splitValueOfSpaceKeywordInString(removeSpaceWordInString(value)) :
                splitValueOfSpaceKeywordInString(`${EQUAL_TO} ${value}`),
            isOperatorIn = isInOperatorInString(value),
            isValidOperatorForUpdateSqlQueryInArray = arrayOfValidOperatorQuery.includes(keyword),
            arrayOfSpecialQueryUtilitiesOperator = [],
            isAccessToCheckOtherCondition = false,
            newArrayForOperatorAndValue2d = [];


        if (!isAccessToCheckOtherCondition && !isOperatorIn &&
            !isValidOperatorForUpdateSqlQueryInArray && !isDefinedArrayOfOperatorAndValue) { // this
            arrayOfKeyAndValueDataForQuery.push(key);
            arrayOfKeyAndValueDataForQuery.push(`${newValue}`);
        }


        if (isOperatorIn && isFirstIndex) {
            arrayOfKeyAndValueDataForQuery.push(key);
            arrayOfEqualAndQuestionMarks.push(`IN (?) `);
            arrayOfKeyAndValueDataForQuery.push(arrayOfValueForInOperator(value));
            index++;
        }


        if (isOperatorIn && !isFirstIndex) {
            arrayOfKeyAndValueDataForQuery.push(key);
            arrayOfEqualAndQuestionMarks.push(`${DOUBLE_QUESTION_MARK} IN (?) `);
            arrayOfKeyAndValueDataForQuery.push(arrayOfValueForInOperator(value));
            index++;
        }

        if (isOperatorLike || isOperatorBetween) {
            arrayOfKeyAndValueDataForQuery.push(value); // this not okay
            arrayOfKeyAndValueDataForQuery.push(value); // this not okay
        }

        if (isOperatorAnd)
            arrayOfKeyAndValueDataForQuery.push(`${value}`);


        if (isOperatorBetween && !isFirstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${DOUBLE_QUESTION_MARK} ${keyword} ${QUESTION_MARK} `);
            isKeywordBetweenUsed = true;
            index++;
        }

        if (isOperatorBetween && isFirstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} ${QUESTION_MARK} `);
            isKeywordBetweenUsed = true;
            index++;
        }

        if (isOperatorAnd && isKeywordBetweenUsed) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} ${QUESTION_MARK} `);
            isKeywordBetweenUsed = false;
            index++;
        }


        if (isOperatorLike && !isFirstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${DOUBLE_QUESTION_MARK} ${keyword} ${QUESTION_MARK} `);
            index++;
        }

        if (isOperatorLike && isFirstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} ${QUESTION_MARK} `);
            index++;
        }


        if (isValidOperatorForUpdateSqlQueryInArray) {
            index++;
            continue;
        }


        if (!isDefinedArrayOfOperatorAndValue)
            continue;


        arrayOfOperatorAndValue2d.forEach(item2d => { // defualt = <= ...

            item2d.forEach((item, index) => {

                let isAndOperator = item === AND;
                let isOrOperator = item === OR;

                if (isAndOperator || isOrOperator) {
                    arrayOfSpecialQueryUtilitiesOperator.push(item);
                    item2d.splice(index, 1);
                }

            });

            arrayOfKeyAndValueDataForQuery = arrayOfKeyAndValueDataForQuery.concat(item2d);
            newArrayForOperatorAndValue2d = newArrayForOperatorAndValue2d.concat(item2d);

        });
        delete jsonObject['op'];
        let isArrayFor2dHaveOneKeyAndValue = (newArrayForOperatorAndValue2d.length === 2),
            isArrayFor2dHaveMoreThanOneKeyAndValue = (newArrayForOperatorAndValue2d.length > 2);


        let operator = (isSpaceWordInString) ? splitOperatorInString(removeSpaceWordInString(value)) :
            splitOperatorInString(`${EQUAL_TO} ${value}`);


        let initPlaceHolder = `${DOUBLE_QUESTION_MARK} ${operator} ${QUESTION_MARK}`;

        if (isFirstIndex && (isArrayFor2dHaveOneKeyAndValue || isArrayFor2dHaveMoreThanOneKeyAndValue)) { // this
            arrayOfEqualAndQuestionMarks.push(`${operator} ${QUESTION_MARK} `);
            index++;
        }


        if (isArrayFor2dHaveOneKeyAndValue || isArrayFor2dHaveMoreThanOneKeyAndValue) { // this

            arrayOfSpecialQueryUtilitiesOperator.forEach(item => {

                arrayOfEqualAndQuestionMarks.push(`${item}`);
                arrayOfEqualAndQuestionMarks.push(`${initPlaceHolder} `);

            });

            index++;
        }


        // if (!isFirstIndex && !isAccessToCheckOtherCondition && isArrayFor2dHaveMoreThanOneKeyAndValue) { // this
        //     arrayOfEqualAndQuestionMarks.push(`${initPlaceHolder} `);
        //     index++;
        // }


    }
    return arrayOfEqualAndQuestionMarks.join(' ');
}


module.exports = {


    sqlQuery: '',
    stringOfDataForForSet: '',
    dataForInsertSqlQuery: [],
    stringOfValueWithComma: '',
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


    generateValueWithComma(data) {

        if (typeof data === 'string')
            return module.exports.stringOfValueWithComma = data;

        let stringOfValueWithComma = '';


        data.forEach((item, index, array) => {

            let isLastIndex = array.length === index + 1;


            if (!isLastIndex)
                stringOfValueWithComma += `${item} ${COMMA} `;

            if (isLastIndex)
                stringOfValueWithComma += item;


        });

        return stringOfValueWithComma;
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
            isWhereCondition = (jsonArray.where !== undefined),
            isLimit = (jsonArray.limit !== undefined);


        if (jsonArray.optionKeyword === undefined)
            return module.exports.sqlQuery = '';


        jsonArray.optionKeyword.forEach((item, index, arrayOfKeyword) => {
            let isFirstIndex = (index === 0),
                nextKeyword = arrayOfKeyword[index + 1],
                isItemInOperators = arrayOfOperator.includes(item),
                isOptionKeyword = arrayOfValidOptionKeyword.includes(nextKeyword),
                isNextKeywordUndefined = (nextKeyword !== undefined),
                isNextItemOffset = (isNextKeywordUndefined && nextKeyword === OFFSET) ? `${OFFSET} ${QUESTION_MARK}` : '',
                nextItemUndefinedToNullOrValue = (isNextKeywordUndefined && !isOptionKeyword) ? nextKeyword : '';


            if (isFirstIndex && isItemInOperators)
                newArrayOfKeywordsWithSqlContext.push(` ${item} ${QUESTION_MARK} ${nextItemUndefinedToNullOrValue} `);


            if (!isFirstIndex && isItemInOperators)
                newArrayOfKeywordsWithSqlContext.push(` ${DOUBLE_QUESTION_MARK} ${item} ${QUESTION_MARK} ${nextItemUndefinedToNullOrValue}`);


            if (item === BETWEEN && !isFirstIndex && isWhereCondition)
                newArrayOfKeywordsWithSqlContext.push(` ${DOUBLE_QUESTION_MARK} ${item} ${QUESTION_MARK} ${AND} ${QUESTION_MARK} ${nextItemUndefinedToNullOrValue}`);


            if (item === BETWEEN && isFirstIndex && isWhereCondition)
                newArrayOfKeywordsWithSqlContext.push(` ${item} ${QUESTION_MARK} ${AND} ${QUESTION_MARK} ${nextItemUndefinedToNullOrValue}`);


            if (item === IN && isFirstIndex)
                newArrayOfKeywordsWithSqlContext.push(` ${item} ${nextItemUndefinedToNullOrValue}`);


            if (item === IN && !isFirstIndex)
                newArrayOfKeywordsWithSqlContext.push(` ${DOUBLE_QUESTION_MARK} ${item} ${nextItemUndefinedToNullOrValue}`);


            if (item === LIKE && isFirstIndex)
                newArrayOfKeywordsWithSqlContext.push(` ${item} ${QUESTION_MARK} ${nextItemUndefinedToNullOrValue}`);


            if (item === LIKE && !isFirstIndex)
                newArrayOfKeywordsWithSqlContext.push(` ${DOUBLE_QUESTION_MARK} ${item} ${QUESTION_MARK} ${nextItemUndefinedToNullOrValue}`);


            if (item === ORDER_BY)
                newArrayOfKeywordsWithSqlContext.push(`${ORDER_BY} ${QUESTION_MARK}`)


            if (item === ASC || item === DESC)
                newArrayOfKeywordsWithSqlContext.push(` ${item} `);


            if (item === ASC && nextKeyword === DESC || item === DESC && nextKeyword === ASC)
                newArrayOfKeywordsWithSqlContext.push(`${COMMA} ${QUESTION_MARK}`);


            if (isLimit && item === LIMIT)
                newArrayOfKeywordsWithSqlContext.push(` ${item} ${QUESTION_MARK} ${COMMA} ${QUESTION_MARK} ${isNextItemOffset} `);


            if (!isLimit && item === LIMIT)
                newArrayOfKeywordsWithSqlContext.push(` ${item} ${QUESTION_MARK} ${isNextItemOffset} `);


            if (item === IS_NOT_NULL && !isFirstIndex)
                newArrayOfKeywordsWithSqlContext.push(` ${DOUBLE_QUESTION_MARK} ${item} `);


            if (item === IS_NOT_NULL && isFirstIndex)
                newArrayOfKeywordsWithSqlContext.push(` ${item} `);


        });

        module.exports.sqlQuery = newArrayOfKeywordsWithSqlContext.join('');

        if (isWhereCondition)
            return module.exports.sqlQuery = `${WHERE} ${DOUBLE_QUESTION_MARK}` +
                `${newArrayOfKeywordsWithSqlContext.join('')} `;


        return module.exports.sqlQuery;
    },


    getCreateTableSqlQuery(jsonArray) {

        let newArrayOfFieldItem = [];

        for (let value in jsonArray.field) {
            let key = jsonArray.field[value];

            newArrayOfFieldItem.push(`${value} ${key}${COMMA} `);
        }

        let query = newArrayOfFieldItem.join('')
            .replace(/,\s*$/, ''); // replace last comma in array

        if (jsonArray.primaryKey !== undefined)
            query += ` ${COMMA} PRIMARY KEY (${jsonArray.primaryKey}) `;


        return module.exports.sqlQuery = query;
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


    removeStringOfValueWithComma() {
        return module.exports.stringOfValueWithComma = '';
    },


    removeSqlQuery() {
        return module.exports.sqlQuery = '';
    },


    removeStringOfDataForForSet() {
        return module.exports.stringOfDataForForSet = '';
    },


    removeDataForInsertSqlQuery() {
        return module.exports.dataForInsertSqlQuery = [];
    },


    removeArrayOfDataForUpdateOrDeleteQuery() {
        return module.exports.arrayOfDataForUpdateOrDeleteQuery = '';
    },


    getData() {
        return fieldData;
    },


    removeFieldDataInSelect(jsonArray) {
        let index = jsonArray.optionKeyword[0],
            isPointField = /X\(/.test(index),
            optionKeywordArray = jsonArray.optionKeyword;

        if (index !== STAR && COUNT && !isPointField) {
            fieldData = DOUBLE_QUESTION_MARK;
        }

        if (index !== STAR && COUNT && isPointField) {
            fieldData = index;
            optionKeywordArray.shift();
        }

        if (index === STAR) {
            fieldData = STAR;
            optionKeywordArray.shift();
        }

        if (index === COUNT) {
            fieldData = `${COUNT} AS size`;
            optionKeywordArray.shift();
        }

        return optionKeywordArray;
    }


}
