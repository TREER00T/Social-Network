const {
        query,
        sqlQueryResult
    } = require('../util/DatabaseConnection'),
    {
        WHERE,
        IF_NOT_EXISTS,
        QUESTION_MARK,
        DOUBLE_QUESTION_MARK
    } = require('./util/SqlKeyword'),
    {
        getError,
        getCreateTableSqlQuery,
        getOptionKeywordSqlQuery,
        generateDeleteSqlQueryWithData,
        generateUpdateSqlQueryWithData
    } = require('./util/Utilites'),
    util = require('./util/Utilites');


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
            `(` + '`' + jsonObject.filed + '`' + `) ON DELETE ` +
            `${jsonObject.onDelete} ON UPDATE ${jsonObject.onUpdate}`;

        query(realSql, {}, getError('Can not add foreign key'));

        return this;
    },


    remove(jsonObject) {

        generateDeleteSqlQueryWithData(jsonObject);

        realSql = USE_DATABASE + 'DELETE FROM ?? WHERE ?? ' + util.sqlQuery;

        query(realSql, util.arrayOfDataForUpdateQuery, getError('Failed to delete rows'));

        return this;
    },


    update(jsonObject) {

        generateUpdateSqlQueryWithData(jsonObject);

        realSql = USE_DATABASE + ' UPDATE ?? ' + `SET ${util.stringOfDataForForSet} ${WHERE} ?? ` + util.sqlQuery;

        query(realSql, util.arrayOfDataForUpdateQuery, getError('Failed to update rows'));

        return this;
    },


    add(jsonArray) {

        realSql = USE_DATABASE + ' INSERT INTO ' + jsonArray.table + ' SET ' + QUESTION_MARK;

        query(realSql, jsonArray.data, getError('Failed to insert rows'));

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
