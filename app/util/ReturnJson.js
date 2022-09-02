// instance of response object express
let res;

module.exports = {

    builder(obj, data = null, option) {
        let jsonContent = JSON.stringify(module.exports.jsonObject(obj, data, option));
        res.status(obj.code).json(jsonContent);
    },

    initializationRes(response) {
        res = response;
    },

    jsonObject(obj, data, option) {
        if (option !== undefined)
            return (data != null) ? {
                code: `${obj.code}`,
                message: `${obj.message}`,
                data: data,
                option: option
            } : obj;

        return (data != null) ? {
            code: `${obj.code}`,
            message: `${obj.message}`,
            data: data
        } : obj;
    }

}