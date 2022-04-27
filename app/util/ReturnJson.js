// instance of response object express
let res;

module.exports = {

    builder(obj, arr = null) {
        let jsonContent = JSON.stringify(module.exports.jsonObject(obj, arr));
        res.end(jsonContent);
    },

    initializationRes(response) {
        res = response;
    },

    jsonObject(obj, arr) {
        return (arr != null) ? {'code': `${obj.code}`, 'message': `${obj.message}`, 'data': arr} : obj;
    }

}