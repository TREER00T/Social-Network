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
    GREATER_THAN,
    NOT_EQUAL_TO,
    QUESTION_MARK,
    DOUBLE_QUESTION_MARK,
    LESS_THAN_OR_EQUAL_TO,
    GREATER_THAN_OR_EQUAL_TO
} = require('./SqlKeyword');


let stringOFQuestionMarkAndEqual,
    arrayOFKeyAndValueDateForUpdateQuery = [];
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

    return stringOFQuestionMarkAndEqual = mergeQuestionMarksWithEqual;
}


function generateArrayOfKeyAndValueForSqlQuery(jsonObject) {
    let arrayOfKeyAndValue = [],
        index = 0,
        size = 0;
    for (let key in jsonObject.editField) {
        let value = jsonObject.editField[key];
        arrayOFKeyAndValueDateForUpdateQuery.push(key);
        arrayOFKeyAndValueDateForUpdateQuery.push(value.toString());
        arrayOfKeyAndValue.push(`${key}`);
        index++;
        size++;
        arrayOfKeyAndValue[index++] = `${value}`;
    }
    arrayOfKeyAndValue.unshift(`${jsonObject.table}`);
    generateDoubleQuestionMarksEqualQuestionMark(size);
    return arrayOfKeyAndValue;
}


function splitValueInString(str) {
    return str.split(' ')[1];
}

function splitOperatorInString(str) {
    return str.split(' ')[0];
}

function splitDataFormOperatorIn(str) {
    let newArray;
    newArray = str.split(' ');
    newArray.splice(0, 1);
    newArray.slice();
    return newArray;
}

function removeUnderscoreInString(str) {
    return str.replaceAll('_', ' ').toUpperCase();
}

function splitColumnFormOperatorIn(str) {
    return str.split(' ')[0];
}

function removeSpaceWordInString(str) {
    return str.replace('SPACE', '');
}

let arrayOfValidOperatorQuery = [
    OR,
    AND,
    LIKE,
    BETWEEN,
    OPERATOR_IN
];


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
            arrayOFKeyAndValueDateForUpdateQuery.push(key);
            arrayOFKeyAndValueDateForUpdateQuery.push(`${newValue}`);
        }


        if (isOperatorIn && firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${keyword} (?) `);
            arrayOFKeyAndValueDateForUpdateQuery.push(splitColumnFormOperatorIn(value));
            arrayOFKeyAndValueDateForUpdateQuery.push(splitDataFormOperatorIn(value));
            index++;
        }


        if (isOperatorIn && !firstIndex) {
            arrayOfEqualAndQuestionMarks.push(`${DOUBLE_QUESTION_MARK} ${keyword} (?) `);
            arrayOFKeyAndValueDateForUpdateQuery.push(splitColumnFormOperatorIn(value));
            arrayOFKeyAndValueDateForUpdateQuery.push(splitDataFormOperatorIn(value));
            index++;
        }

        if (isOperatorLike || isOperatorBetween || isOperatorAnd)
            arrayOFKeyAndValueDateForUpdateQuery.push(`${value}`);


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
    arrayOfDataForUpdateQuery: '',
    stringOfDataForForSet: '',


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

        module.exports.sqlQuery = getQueryAndCheckOtherConditionInWhereObject(jsonObject.where);

        module.exports.stringOfDataForForSet = stringOFQuestionMarkAndEqual;

        arrayOFKeyAndValueDateForUpdateQuery.unshift(jsonObject.table);

        module.exports.arrayOfDataForUpdateQuery = arrayOFKeyAndValueDateForUpdateQuery;

    }


}
