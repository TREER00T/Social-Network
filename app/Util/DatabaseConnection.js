const mysql = require('mysql'),
    dotenv = require('dotenv');

dotenv.config();

    
const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    charset: process.env.CHARSET
});



exports.query = (sql,obj,callBack,err)=>{
    con.connect(()=>{
        try{
            con.query(sql,obj, (err, result)=> {
                callBack(err, result);
            });
        }catch(e){
            throw new Error(err)
        }
    });
}
