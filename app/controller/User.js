var { isPhoneNumber , isVerificationCode,
     splitBeararJwt, jwtDecrypt , jwtVerify }  = require('../Util/Validation'),
    Database                                   = require('../Util/DatabaseHelper'),
    { json }                                   = require('../Util/ReturnJson'),
    { jwtEncrypt , jwtSign , jwtRefresh ,
        VerificationCode }                     = require('../Util/Generate'),
    Response                                   = require('../Util/Response');



exports.generateVerificationCodeAndGetPhoneNumber = (req,res)=>{

    let phoneNumber = req.body.phoneNumber;

    if(isPhoneNumber(phoneNumber)){

        return Database.insertPhoneAndVerificationCode(phoneNumber,VerificationCode(),(result)=>{

            if(!result){
                return Database.updateVerificationCode(phoneNumber,VerificationCode(),(result)=>{
                    if(result){
                        json(res,
                            Response.HTTP_OK
                        )   
                    }
                });
            }

            json(res,
                Response.HTTP_CREATED
            )

        });

    }

    json(res,
        Response.HTTP_BAD_REQUEST
    )

}

exports.checkVerificationCodeInDatabaseAndSingUpOrLogin = (req,res)=>{

    let phoneNumber = req.body.phoneNumber;
    let verificationCode = req.body.verificationCode;

    if(isPhoneNumber(phoneNumber) && isVerificationCode(verificationCode)){
        
            return Database.checkVerificationCode(phoneNumber,verificationCode,(result)=>{
                if(!result){
                    return json(res,
                        Response.HTTP_UNAUTHORIZED
                    )
                }
               
                (async () => {
                    json(res,
                        Response.HTTP_ACCEPTED,
                        {
                           'accessToken'  : await jwtEncrypt(jwtSign({'phoneNumber':`${phoneNumber}`,type:'at'},phoneNumber)),
                           'refreshToken' : await jwtEncrypt(jwtRefresh({'phoneNumber':`${phoneNumber}`,type:'rt'},phoneNumber))
                        }
                    )
                })()  
                
            });

    }
    json(res,
        Response.HTTP_BAD_REQUEST
    )
}

exports.test = (req,res)=>{
    let bearerHeader = req.headers['authorization'];
    (async () => { 
       let token = await jwtDecrypt(splitBeararJwt(bearerHeader))
       jwtVerify(res,token.replace(/["]+/g, ''),{},(decoded)=>{
          
           if(Date.now() >= decoded.exp * 1000){
                console.log('yes');
           }
       })
    })()  
}