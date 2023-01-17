import {TokenExpiredError, JsonWebTokenError} from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import {JWK, parse} from "node-jose";
import Json from "../util/ReturnJson";
import Response from "../util/Response";
import * as dotenv from "dotenv";
import {ValidationException} from "../exception/ValidationException";

dotenv.config();

export default {

    requestEndpointHandler(requestEndpoint: string): string {
        const arrayOfHttpUrls = [
            "/api/v1/auth/generate/user",
            "/api/v1/auth/generate/user/",
            "/api/v1/auth/verify/otp",
            "/api/v1/auth/verify/otp/"
        ];

        //                                                      Searching in string to ensure exactly string
        //                                                      In some case it was break something like this: /api/channel/1452/us
        return arrayOfHttpUrls.includes(requestEndpoint) || /\/api\/v1\/common\/search[\/]?(.*)/.test(requestEndpoint)
            ? requestEndpoint.match(/\d+/g)?.length > 0 ? "AuthRoute" : "" : "";
    },

    // Verify jwt and check jwt expired time
    async getJwtVerify(token): Promise<any> {

        return new Promise(async res => {

            try {
                jwt.verify(token, process.env.PUBLIC_KEY, {}, (err, decoded) => {

                    if (err instanceof TokenExpiredError) {
                        res("TOKEN_EXP");
                        return Json.builder(Response.HTTP_UNAUTHORIZED_TOKEN_EXP);
                    }

                    if (err instanceof JsonWebTokenError) {
                        res("IN_VALID_TOKEN");
                        return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_TOKEN);
                    }

                    res(decoded);
                });
            } catch (e) {
                ValidationException(e);
            }

        });

    },


    // The jwt decrypt with JWK library and return jwt
    async getJwtDecrypt(encryptedBody) {
        try {
            let keystore = JWK.createKeyStore();
            await keystore.add(await JWK.asKey(process.env.JWE_PRAIVATE_KEY, "pem"));
            let outPut = parse.compact(encryptedBody);
            let decryptedVal = await outPut.perform(keystore);
            let token = Buffer.from(decryptedVal.plaintext).toString();

            if (!decryptedVal?.plaintext)
                return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_TOKEN);

            return token.replace(/["]+/g, "");

        } catch (e) {
            ValidationException(e);
        }
    },


    // Returns split jwt without bearer
    getSplitBearerJwt(bearerHeader) {
        try {
            let token = bearerHeader.split(" ")[1];
            if (token && bearerHeader)
                return token;
            return false;
        } catch (e) {
            ValidationException(e);
        }
    }
};
