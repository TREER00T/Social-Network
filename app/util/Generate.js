const jwt = require('jsonwebtoken'),
    {
        JWK,
        JWE
    } = require('node-jose');


module.exports = {


    // Generates verification code E.g : 335496
    getVerificationCode() {
        return Math.floor(100000 + Math.random() * 999999)
    },


    // Signs jwt
    getJwtSign(payload, subject) {
        const signOptions = {
            subject: `${subject}`,
            expiresIn: '12h',
            algorithm: 'RS256'
        };
        return jwt.sign(payload, process.env.PRAIVATE_KEY, signOptions);
    },


    // The jwt encrypt with JWK library
    async getJwtEncrypt(raw, format = 'compact', contentAlg = 'A256GCM', alg = 'RSA-OAEP') {
        let publicKey = await JWK.asKey(process.env.JWT_PUBLIC_KEY, 'pem');
        const buffer = Buffer.from(JSON.stringify(raw))
        return await JWE.createEncrypt(
            {format: format, contentAlg: contentAlg, fields: {alg: alg}}, publicKey)
            .update(buffer).final();
    },


    // Generates refresh jwt
    getJwtRefresh(payload, subject) {
        const signOptions = {
            subject: `${subject}`,
            expiresIn: '1d',
            algorithm: 'RS256'
        };
        return jwt.sign(payload, process.env.PRAIVATE_KEY, signOptions);
    }


}