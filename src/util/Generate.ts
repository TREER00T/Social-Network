import jwt from "jsonwebtoken";
import {JWK, JWE} from "node-jose";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import {JsonObject} from "./Types";

dotenv.config();

export default {

    // Generates verification code E.g : 335496
    getVerificationCode(): number {
        return Math.floor(100000 + Math.random() * 999999);
    },


    // Signs jwt
    getJwtSign(payload: JsonObject, subject: number | string): string {
        const SIGN_OPTIONS = {
            subject: subject,
            expiresIn: payload.expiresIn,
            algorithm: "RS256"
        };

        return jwt.sign(payload, process.env.PRAIVATE_KEY, SIGN_OPTIONS);
    },


    // The jwt encrypt with JWK library
    async getJwtEncrypt(raw, format = "compact", contentAlg = "A256GCM", alg = "RSA-OAEP"): Promise<string> {
        let publicKey = await JWK.asKey(process.env.JWT_PUBLIC_KEY, "pem");
        const buffer = Buffer.from(JSON.stringify(raw));

        return await JWE.createEncrypt({
            format: format,
            contentAlg: contentAlg,
            fields: {
                alg: alg
            }
        }, publicKey).update(buffer).final();
    },

    getHashData(data: string, salt: string | number): string {
        let hash = crypto.pbkdf2Sync(data, salt.toString(),
            1000, 64, `sha512`).toString(`hex`);

        return hash.trim();
    },


    getRandomHash(randomHashSize: number): string {
        const ARRAY_OF_RANDOM_NUMBER = crypto.randomBytes(randomHashSize);

        let formatValidString = "0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz",
            chars = formatValidString.repeat(5),
            str = "";

        ARRAY_OF_RANDOM_NUMBER.forEach((item, index) => {
            str += chars[ARRAY_OF_RANDOM_NUMBER[index]];
        });


        return str.trim();
    },

    makeIdForInviteLink(): string {
        let result = "",
            characters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz",
            charactersLength = characters.length;

        for (let i = 0; i < 20; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));


        return `+${result}`;
    },

    makeIdForPublicLink(id): string {
        return `+${id.toString().trim()}`;
    }

};