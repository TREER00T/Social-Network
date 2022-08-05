// instance of response object express
let res;

module.exports = {

    builder(obj, data = null, option) {
        if (typeof res !== 'undefined') {
            let jsonContent = JSON.stringify(module.exports.jsonObject(obj, data, option));
            res.status(obj.code);
            res.end(jsonContent);
            return true;
        }
        return module.exports.jsonObject(obj, data, option);
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