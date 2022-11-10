let openSql = require('opensql'),
    {
        DataBaseException
    } = require('../../../../exception/DataBaseException'),
    {
        isUndefined
    } = require('../../../../util/Util'),
    UpdateInCommon = require('../../../../model/update/common/common');


module.exports = {

    message(tableName, data, forwardData, cb) {
        if (!isUndefined(data?.forwardDataId)) {
            openSql.addOne({
                table: 'forwardContents',
                data: {
                    conversationId: tableName,
                    conversationType: forwardData['conversationType']
                }
            }).result(result => {
                try {
                    data['forwardDataId'] = result[1].insertId;
                    data['isForward'] = 1;
                    openSql.addOne({
                        table: tableName,
                        data: data
                    }).result(result => {
                        try {
                            let messageId = result[1].insertId;
                            UpdateInCommon.messageIdFromTableForwardContents(data?.forwardDataId, messageId);
                            cb(messageId);
                        } catch (e) {
                            DataBaseException(e);
                        }
                    });

                } catch (e) {
                    DataBaseException(e);
                }
            });
            return;
        }

        openSql.addOne({
            table: tableName,
            data: data
        }).result(result => {
            try {
                cb(result[1].insertId);
            } catch (e) {
                DataBaseException(e);
            }
        });
    }

}