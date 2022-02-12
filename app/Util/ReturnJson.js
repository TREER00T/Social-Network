exports.json = (res,obj,arr = null)=>{
    if(arr != null){
       return  res.status(200).json({'code':`${obj.code}`,'message':`${obj.message}`,'data':arr});
    }
    res.status(200).json(obj);
}