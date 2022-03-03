let res;

exports.builder = (obj, arr = null) => {
    if (this.res != null) {
        return this.res.status(200).json(this.json(obj, arr));
    }
   return this.json(obj,arr)
}

exports.initialization = (res) => {
    this.res = res;
}


exports.json = (obj, arr = null) => {
    return (arr != null) ? {'code': `${obj.code}`, 'message': `${obj.message}`, 'data': arr} : obj;
}
