// instance of response object express
let res;

module.exports = {

    builder(obj, arr = null, option) {
        if (typeof res !== 'undefined') {
            let jsonContent = JSON.stringify(module.exports.jsonObject(obj, arr, option));
            res.end(jsonContent);
            return true;
        }
        return module.exports.jsonObject(obj, arr, option);
    },

    initializationRes(response) {
        res = response;
    },

    jsonObject(obj, arr, option) {
        if (option !== undefined)
            return (arr != null) ? {
                code: `${obj.code}`,
                message: `${obj.message}`,
                option: option,
                data: arr
            } : obj;

        return (arr != null) ? {
            code: `${obj.code}`,
            message: `${obj.message}`,
            data: arr
        } : obj;
    }

}