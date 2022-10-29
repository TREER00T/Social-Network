// instance of response object express
let res;

module.exports = {

    builder(obj, data = null, option) {
        let jsonContent = JSON.parse(JSON.stringify(module.exports.jsonObject(obj, data, option)));
        res.status(obj.code);
        res.send(jsonContent);
    },

    initializationRes(response) {
        res = response;
    },

    jsonObject(obj, data, option) {

        let objectBuilder = {
            code: obj.code,
            message: obj.message,
            data: data
        };

        if (option)
            return (data) ? Object.assign(objectBuilder, {
                option: option
            }) : obj;

        return (data) ? objectBuilder : obj;
    }

}