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
        getError,
        removeSqlQuery,
        getCreateTableSqlQuery,
        getOptionKeywordSqlQuery,
        getStringOfColumnWithComma,
        removeStringOfDataForForSet,
        generateDeleteSqlQueryWithData,
        generateUpdateSqlQueryWithData,
        generateDoubleQuestionMarkAndComma
    } = require('./util/Utilites'),
    util = require('./util/Utilites');
const {log} = require("nodemon/lib/utils");


let realSql;

const DAtABASE_NAME = process.env.DATABASE,
    USE_DATABASE = `USE ${DAtABASE_NAME};`;


module.exports = {


    createDatabase() {
        query(`CREATE DATABASE IF NOT EXISTS ${DAtABASE_NAME}`
            + ` CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
            null, getError('Connection time out'));
        return this;
    },


    createTable(jsonArray) {

        getCreateTableSqlQuery(jsonArray);

        realSql = USE_DATABASE +
            ` CREATE TABLE ${IF_NOT_EXISTS} ${jsonArray.table} ` +
            `(${util.sqlQuery})`;

        query(realSql, {}, getError('Failed to create table'));

        return this;
    },


    addForeignKey(jsonObject) {

        realSql = USE_DATABASE + ' ALTER TABLE ' + '`' + jsonObject.table + '`' +
            ` ADD FOREIGN KEY (` + '`' + jsonObject.foreignKey + '`' + `) ` +
            `REFERENCES ` + '`' + jsonObject.referenceTable + '`' +
            `(` + '`' + jsonObject.field + '`' + `) ON DELETE ` +
            `${jsonObject.onDelete} ON UPDATE ${jsonObject.onUpdate}`;

        query(realSql, {}, getError('Can not add foreign key'));

        return this;
    },


    remove(jsonObject) {

        generateDeleteSqlQueryWithData(jsonObject);

        realSql = USE_DATABASE + 'DELETE FROM ?? WHERE ?? ' + util.sqlQuery;

        query(realSql, util.arrayOfDataForUpdateOrDeleteQuery, getError(jsonObject.throwErr));

        removeSqlQuery();
        removeStringOfDataForForSet();

        return this;
    },


    update(jsonObject) {

        generateUpdateSqlQueryWithData(jsonObject);

        realSql = USE_DATABASE + ' UPDATE ?? ' + `SET ${util.stringOfDataForForSet} ${WHERE} ?? ` + util.sqlQuery;

        query(realSql, util.arrayOfDataForUpdateOrDeleteQuery, getError(jsonObject.throwErr));

        removeSqlQuery();
        removeStringOfDataForForSet();

        return this;
    },


    addOMulti(jsonArray) {

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonArray.table + ' (' +
            generateDoubleQuestionMarkAndComma(jsonArray.data) + ') VALUES ' + QUESTION_MARK;

        query(realSql, util.dataForInsertSqlQuery, getError(jsonArray.throwErr));

        return this;
    },


    addOne(jsonArray){

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonArray.table + ' SET ' + QUESTION_MARK;

        query(realSql, jsonArray.data, getError('Failed to insert rows'));

        return this;

    },


    addWithFind(jsonArray) {

        getOptionKeywordSqlQuery(jsonArray);

        let selectSqlQuery = ' SELECT ' + DOUBLE_QUESTION_MARK +
            ' FROM ' + DOUBLE_QUESTION_MARK + ' ' + util.sqlQuery;

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonArray.table + ` (${getStringOfColumnWithComma(jsonArray.data[0])}) ` + selectSqlQuery;

        query(realSql, jsonArray.data, getError(jsonArray.throwErr));

        return this;
    },


    customQuery(sqlQuery) {

        realSql = USE_DATABASE + ` ${sqlQuery}`;

        query(realSql, {}, getError('Failed to exist custom query'));

        return this;
    },


    find(jsonArray) {

        getOptionKeywordSqlQuery(jsonArray);

        realSql = USE_DATABASE + ' SELECT ' + DOUBLE_QUESTION_MARK +
            ' FROM ' + DOUBLE_QUESTION_MARK + ' ' + util.sqlQuery;

        query(realSql, jsonArray.data, getError(jsonArray.throwErr));

        return this;
    },


    result(callBackResult) {
        sqlQueryResult((result) => {
            callBackResult(result);
        });
    }


}
