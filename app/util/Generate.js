const jwt = require('jsonwebtoken'),
    {
        JWK,
        JWE
    } = require('node-jose'),
    crypto = require('crypto'),
    dotenv = require('dotenv');

dotenv.config();

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
    },


    getApiKey() {
        const rand = crypto.randomBytes(50);

        let formatValidString = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        let chars = formatValidString.repeat(5);

        let str = '';

        for (let i = 0; i < rand.length; i++) {
            let decimal = rand[i];
            str += chars[decimal];
        }

        return str.trim();
    },


    getHashData(data, salt) {

        let hash = crypto.pbkdf2Sync(data, salt,
            1000, 64, `sha512`).toString(`hex`);

        return hash.trim();
    },


    getFileHashName() {
        const rand = crypto.randomBytes(30);

        let formatValidString = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';

        let chars = formatValidString.repeat(5);

        let str = '';

        for (let i = 0; i < rand.length; i++) {
            let decimal = rand[i];
            str += chars[decimal];
        }

        return str.trim();
    },

    makeIdForInviteLink() {
        let result = '';
        let characters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
        let charactersLength = characters.length;
        for (let i = 0; i < 20; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return `+` + result;
    },

    makeIdForPublicLink(id) {
        return `+` + id.toString().trim();
    },

    objectListOfUserActivityForWhereCondition(type, userId) {
        let objectForWhereCondition = {};
        return objectForWhereCondition['listOfUser' + type + 's.userId'] = `${userId}`;
    }


}