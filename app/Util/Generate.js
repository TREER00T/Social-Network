const jwt           = require('jsonwebtoken'),
    { JWK, JWE  } = require('node-jose');

exports.VerificationCode = ()=>{
   return Math.floor(100000 + Math.random() * 999999)
}

exports.jwtSign = (payload,subject)=>{
    const signOptions = {
      subject:  `${subject}`,
      expiresIn:  '12h',
      algorithm:  'RS256'
   };
  return jwt.sign(payload, process.env.PRAIVATE_KEY, signOptions);
} 

exports.jwtEncrypt = async (raw, format = 'compact', contentAlg = 'A256GCM', alg = 'RSA-OAEP') => {
      let publicKey = await JWK.asKey(process.env.JWT_PUBLIC_KEY, 'pem');
      const buffer = Buffer.from(JSON.stringify(raw))
      const encrypted = await JWE.createEncrypt(
        { format: format, contentAlg: contentAlg, fields: { alg: alg } }, publicKey)
        .update(buffer).final();
      return encrypted;
}

exports.jwtRefresh = (payload,subject)=>{
    const signOptions = {
      subject:  `${subject}`,
      expiresIn:  '1d',
      algorithm:  'RS256'
   };
  return jwt.sign(payload, process.env.PRAIVATE_KEY, signOptions);
}

