let {
        forwardContent
    } = require('../../create/common'),
    {deleteMany} = require('../../../database/mongoDbDriverConnection');
import FindInCommon from '../../../model/find/common';

export default {

    async message(tableName: string, listOfId: string[]) {

        for (const item of listOfId) {
            let id: string = await FindInCommon.isForwardData(tableName, item);

            if (id)
                await this.forwardMessage(id);
        }

        await deleteMany({_id: {$in: listOfId}}, tableName);

    },

    async forwardMessage(id: string) {

        await forwardContent().findByIdAndDelete(id);

    }

}