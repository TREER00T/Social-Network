const {
        query,
        sqlQueryResult
    } = require('../Util/DatabaseConnection'),
    {
        DOUBLE_QUESTION_MARK,
        IF_NOT_EXISTS, QUESTION_MARK
    } = require('./util/SqlKeyword'),
    {
        getError,
        getCreateTableSqlQuery,
        generateUpdateSqlQuery,
        getOptionKeywordSqlQuery
    } = require('./util/Utilites'),
    util = require('./util/Utilites');


let realSql;

const DAtABASE_NAME = process.env.DATABASE,
    USE_DATABASE = `USE ${DAtABASE_NAME};`;


module.exports = {


    // finish
    createDatabase() {
        query(`CREATE DATABASE IF NOT EXISTS ${DAtABASE_NAME}`
            + ` CHARACTER SET utf8 COLLATE utf8_unicode_ci`,
            null, getError('Connection time out'));
        return this;
    },


    // finish
    createTable(jsonArray) {
        getCreateTableSqlQuery(jsonArray);

        realSql = `${USE_DATABASE}` +
            ` CREATE TABLE ${IF_NOT_EXISTS} ${jsonArray.table} ` +
            `(${util.sqlQuery})`;

        query(realSql, {}, getError('Failed to create table'));

        return this;
    },


    // finish
    addForeignKey(jsonObject) {
        realSql = USE_DATABASE + ' ALTER TABLE ' + '`' + jsonObject.table + '`' +
            ` ADD FOREIGN KEY (` + '`' + jsonObject.foreignKey + '`' + `) ` +
            `REFERENCES ` + '`' + jsonObject.referenceTable + '`' +
            `(` + '`' + jsonObject.filed + '`' + `) ON DELETE ` +
            `${jsonObject.onDelete} ON UPDATE ${jsonObject.onUpdate}`;

        query(realSql, {}, getError('Can not add foreign key'));

        return this;
    },


    remove() {
        // TODO
        return this;
    },


    update(jsonObject) {

        generateUpdateSqlQuery(jsonObject);
        // console.log(generateDoubleQuestionMarksEqualQuestionMark(['users', 'verificationCode', '1225', 'phoneNumber', '09030207892']));
        //   query(`${USE_DATABASE} UPDATE ?? SET ?? = ?,??=? WHERE ?? = ? `, ['users','verificationCode','122875','username','ali','phoneNumber','09030207892'], getError());

        return this;
    },


    // finish
    add(jsonArray) {
        realSql = `${USE_DATABASE}` + `INSERT INTO ${jsonArray.table}` + ` SET ${QUESTION_MARK}`;

        query(realSql, jsonArray.data, getError('Failed to insert Rows'));

        return this;
    },


    // finish
    find(jsonArray) {
        getOptionKeywordSqlQuery(jsonArray);

        realSql = `${USE_DATABASE} SELECT ${DOUBLE_QUESTION_MARK} ` +
            ` FROM ${DOUBLE_QUESTION_MARK} ${util.sqlQuery}`;

        query(realSql, jsonArray.data, getError(jsonArray.throwErr));

        return this;
    },


    // finish
    result(callBackResult) {
        sqlQueryResult((result) => {
            callBackResult(result);
        });
    }

}
