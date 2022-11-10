let jwt = require('jsonwebtoken'),
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
        return Math.floor(100000 + Math.random() * 999999);
    },


    // Signs jwt
    getJwtSign(payload, subject) {
        const SIGN_OPTIONS = {
            subject: `${subject}`,
            expiresIn: payload.expiresIn,
            algorithm: 'RS256'
        };

        return jwt.sign(payload, process.env.PRAIVATE_KEY, SIGN_OPTIONS);
    },


    // The jwt encrypt with JWK library
    async getJwtEncrypt(raw, format = 'compact', contentAlg = 'A256GCM', alg = 'RSA-OAEP') {
        let publicKey = await JWK.asKey(process.env.JWT_PUBLIC_KEY, 'pem');
        const buffer = Buffer.from(JSON.stringify(raw));

        return await JWE.createEncrypt({
            format: format,
            contentAlg: contentAlg,
            fields: {
                alg: alg
            }
        }, publicKey).update(buffer).final();
    },

    getHashData(data, salt) {
        let hash = crypto.pbkdf2Sync(data, salt,
            1000, 64, `sha512`).toString(`hex`);

        return hash.trim();
    },


    getRandomHash(randomHashSize) {
        const ARRAY_OF_RANDOM_NUMBER = crypto.randomBytes(randomHashSize);

        let formatValidString = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
            chars = formatValidString.repeat(5),
            str = '';

        ARRAY_OF_RANDOM_NUMBER.forEach((item, index) => {
            str += chars[ARRAY_OF_RANDOM_NUMBER[index]];
        });


        return str.trim();
    },

    makeIdForInviteLink() {
        let result = '',
            characters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
            charactersLength = characters.length;

        for (let i = 0; i < 20; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));


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