const {
        query,
        sqlQueryResult
    } = require('app/database/DatabaseConnection'),
    {
        WHERE,
        QUESTION_MARK,
        IF_NOT_EXISTS,
        DOUBLE_QUESTION_MARK
    } = require('./util/SqlKeyword'),
    {
        getData,
        removeSqlQuery,
        removeStarInArray,
        generateValueWithComma,
        getCreateTableSqlQuery,
        getOptionKeywordSqlQuery,
        getStringOfColumnWithComma,
        removeStringOfDataForForSet,
        removeDataForInsertSqlQuery,
        removeStringOfValueWithComma,
        generateDeleteSqlQueryWithData,
        generateUpdateSqlQueryWithData,
        generateDoubleQuestionMarkAndComma,
        removeArrayOfDataForUpdateOrDeleteQuery
    } = require('./util/Utilites'),
    util = require('./util/Utilites');


let realSql;

const DAtABASE_NAME = process.env.DATABASE,
    USE_DATABASE = `USE ${DAtABASE_NAME};`;


module.exports = {


    createDatabase() {
        query(`CREATE DATABASE IF NOT EXISTS ${DAtABASE_NAME}`
            + ` CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
            null);
        return this;
    },


    createTable(jsonArray) {

        getCreateTableSqlQuery(jsonArray);

        realSql = USE_DATABASE +
            ` CREATE TABLE ${IF_NOT_EXISTS} ${jsonArray.table} ` +
            `(${util.sqlQuery})`;

        query(realSql, null);

        removeSqlQuery();

        return this;
    },


    dropTable(data) {

        generateValueWithComma(data);

        realSql = USE_DATABASE + 'Drop Table IF EXISTS ' + util.stringOfValueWithComma;

        query(realSql,{});

        removeStringOfValueWithComma();

        return this;
    },


    addForeignKey(jsonObject) {

        realSql = USE_DATABASE + ' ALTER TABLE ' + '`' + jsonObject.table + '`' +
            ` ADD FOREIGN KEY (` + '`' + jsonObject.foreignKey + '`' + `) ` +
            `REFERENCES ` + '`' + jsonObject.referenceTable + '`' +
            `(` + '`' + jsonObject.field + '`' + `) ON DELETE ` +
            `${jsonObject.onDelete} ON UPDATE ${jsonObject.onUpdate}`;

        query(realSql, null);

        return this;
    },


    remove(jsonObject) {

        generateDeleteSqlQueryWithData(jsonObject);

        realSql = USE_DATABASE + 'DELETE FROM ' + DOUBLE_QUESTION_MARK + ' WHERE ' +
            DOUBLE_QUESTION_MARK + util.sqlQuery;

        query(realSql, util.arrayOfDataForUpdateOrDeleteQuery);

        removeSqlQuery();
        removeStringOfDataForForSet();
        removeArrayOfDataForUpdateOrDeleteQuery();

        return this;
    },


    update(jsonObject) {

        generateUpdateSqlQueryWithData(jsonObject);

        realSql = USE_DATABASE + ' UPDATE ' + DOUBLE_QUESTION_MARK +
            `SET ${util.stringOfDataForForSet} ${WHERE} ${DOUBLE_QUESTION_MARK} ` + util.sqlQuery;

        query(realSql, util.arrayOfDataForUpdateOrDeleteQuery);

        removeSqlQuery();
        removeStringOfDataForForSet();
        removeArrayOfDataForUpdateOrDeleteQuery();

        return this;
    },


    addOMulti(jsonArray) {

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonArray.table + ' (' +
            generateDoubleQuestionMarkAndComma(jsonArray.data) + ') VALUES ' + QUESTION_MARK;

        query(realSql, util.dataForInsertSqlQuery);

        removeDataForInsertSqlQuery();

        return this;
    },


    addOne(jsonArray) {

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonArray.table + ' SET ' + QUESTION_MARK;

        query(realSql, jsonArray.data);

        return this;

    },


    addWithFind(jsonArray) {

        getOptionKeywordSqlQuery(jsonArray);

        let selectSqlQuery = ' SELECT ' + DOUBLE_QUESTION_MARK +
            ' FROM ' + DOUBLE_QUESTION_MARK + ' ' + util.sqlQuery;

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonArray.table + ` (${getStringOfColumnWithComma(jsonArray.data[0])}) ` + selectSqlQuery;

        query(realSql, jsonArray.data);

        removeSqlQuery();

        return this;
    },


    customQuery(sqlQuery) {

        realSql = USE_DATABASE + ` ${sqlQuery}`;

        query(realSql, null);

        return this;
    },


    find(jsonArray) {

        getOptionKeywordSqlQuery(jsonArray);

        removeStarInArray(jsonArray);

        realSql = USE_DATABASE + ' SELECT ' + getData() +
            ' FROM ' + DOUBLE_QUESTION_MARK + ' ' + util.sqlQuery;

        query(realSql, jsonArray.data);

        removeSqlQuery();

        return this;
    },


    result(callBackResult) {
        sqlQueryResult((result) => {
            callBackResult(result);
        });
    }


}