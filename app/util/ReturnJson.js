// instance of response object express
let res;

module.exports = {
    builder(obj, arr = null) {
        if (res != null) {
            return res.status(obj.code).json(module.exports.json(obj, arr));
        }
        return module.exports.json(obj, arr)
    },

    initializationRes(response) {
        res = response;
    },

    json(obj, arr = null) {
        return (arr != null) ? {'code': `${obj.code}`, 'message': `${obj.message}`, 'data': arr} : obj;
    }
}