const {
        query,
        sqlQueryResult
    } = require('app/database/DatabaseConnection'),
    {
        QUESTION_MARK,
        IF_NOT_EXISTS,
        DOUBLE_QUESTION_MARK
    } = require('app/database/util/KeywordHelper'),
    {
        getData,
        removeSqlQuery,
        removeFieldDataInSelect,
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


    createTable(jsonObject) {

        getCreateTableSqlQuery(jsonObject);

        realSql = USE_DATABASE +
            ` CREATE TABLE ${IF_NOT_EXISTS} ` + '`' + jsonObject.table + '`' +
            `(${util.sqlQuery})`;

        query(realSql, null);

        removeSqlQuery();

        return this;
    },


    dropTable(data) {

        generateValueWithComma(data);

        realSql = USE_DATABASE + 'Drop Table IF EXISTS ' + util.stringOfValueWithComma;

        query(realSql, {});

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
            `SET ${util.stringOfDataForForSet} WHERE ${DOUBLE_QUESTION_MARK} ` + util.sqlQuery;

        console.log(util.arrayOfDataForUpdateOrDeleteQuery);
        console.log(util.sqlQuery);
        //   query(realSql, util.arrayOfDataForUpdateOrDeleteQuery);

        removeSqlQuery();
        removeStringOfDataForForSet();
        removeArrayOfDataForUpdateOrDeleteQuery();

        return this;
    },


    addMultiValue(jsonObject) {

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonObject.table + ' (' +
            generateDoubleQuestionMarkAndComma(jsonObject.data) + ') VALUES ' + QUESTION_MARK;

        query(realSql, util.dataForInsertSqlQuery);

        removeDataForInsertSqlQuery();

        return this;
    },


    addOne(jsonObject) {

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonObject.table + ' SET ' + QUESTION_MARK;

        query(realSql, jsonObject.data);

        return this;

    },


    addWithFind(jsonObject) {

        getOptionKeywordSqlQuery(jsonObject);

        let selectSqlQuery = ' SELECT ' + DOUBLE_QUESTION_MARK +
            ' FROM ' + DOUBLE_QUESTION_MARK + ' ' + util.sqlQuery;

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonObject.table +
            ` (${getStringOfColumnWithComma(jsonObject.data[0])}) ` + selectSqlQuery;

        query(realSql, jsonObject.data);

        removeSqlQuery();

        return this;
    },


    customQuery(sqlQuery) {

        realSql = USE_DATABASE + ` ${sqlQuery}`;

        query(realSql, null);

        return this;
    },


    find(jsonObject) {

        getOptionKeywordSqlQuery(jsonObject);

        removeFieldDataInSelect(jsonObject);

        realSql = USE_DATABASE + ' SELECT ' + getData() +
            ' FROM ' + DOUBLE_QUESTION_MARK + ' ' + util.sqlQuery;

        query(realSql, jsonObject.data);

        removeSqlQuery();

        return this;
    },


    findTable(tableName) {

        realSql = 'SELECT TABLE_NAME ' +
            'FROM INFORMATION_SCHEMA.TABLES ' +
            'WHERE TABLE_NAME = ' + "'" + tableName + "' " +
            'and TABLE_SCHEMA = ' + "'" + DAtABASE_NAME + "'";

        query(realSql, null);

        return this;
    },


    result(callBackResult) {
        if (typeof callBackResult === 'function')
            sqlQueryResult(result => {
                callBackResult(result);
            });
    }


}