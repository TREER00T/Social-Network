let {model} = require('./creator');


module.exports = {

    forwardContent() {

        return model({
            messageId: String,
            conversationId: String,
            conversationType: String
        }, 'forwardContent');

    }

}