let Json = require('./ReturnJson'),
    Response = require('./Response'),
    Util = require('./Util'),
    jwt = require('jsonwebtoken'),
    {
        JWK,
        parse
    } = require('node-jose'),
    {
        ValidationException
    } = require('app/exception/ValidationException'), {
        TokenExpiredError, JsonWebTokenError
    } = require('jsonwebtoken');


module.exports = {

    // Checks phone number E.g : 09030207892 return true
    isPhoneNumber(data) {
        try {
            return /^\d+$/.test(data);
        } catch (e) {
            ValidationException(e);
        }
    },


    // Checks the verification code E.g : 335486 return true
    isVerificationCode(code) {
        try {
            return /^[0-9]{6}$/.test(code);
        } catch (e) {
            ValidationException(e);
        }
    },


    isRouteWithOutAuthentication(url, app) {

        let arrayOfRouteWithOutAuth = [
            '/apiDocs',
            '/api/auth/generate/user',
            '/api/auth/verify/authCode'
        ];

        let arrayOfRoute = [];


        function print(path, layer) {
            if (layer.route)
                layer.route.stack.forEach(print.bind(null, path.concat(Util.splitRoute(layer.route.path))));


            if (layer.name === 'router' && layer.handle.stack)
                layer.handle.stack.forEach(print.bind(null, path.concat(Util.splitRoute(layer.regexp))));


            if (layer.method)
                arrayOfRoute.push('/' + path.concat(Util.splitRoute(layer.regexp)).filter(Boolean).join('/') + '/');
        }

        app._router.stack.forEach(print.bind(null, []));


        let arr = [false, false],
            statusAllAppRoute = () => arr[0],
            statusForRouteWithOutAuth = () => arr[1]


        for (let index in arrayOfRoute) {
            let item = arrayOfRoute[index];
            let isEqualRouteWithDoubleSlash = item === url + '/',
                isEqualRoute = item === url;

            if (isEqualRoute || isEqualRouteWithDoubleSlash) {
                arr[0] = true;
                break;
            }

        }

        for (let index in arrayOfRouteWithOutAuth) {
            let item = arrayOfRouteWithOutAuth[index];

            let isEqualRoute = url === item,
                isEqualRouteWithDoubleSlash = url === item + '/';

            if (isEqualRoute || isEqualRouteWithDoubleSlash) {
                arr[1] = true;
                break;
            }
        }


        return statusAllAppRoute() === true ? {msg: 'AllValidRoute'} :
            statusForRouteWithOutAuth() === true ? {msg: 'RouteForWithOutAuth'} : {msg: 'NotFound'};
    },


    // If http method not found in httpMethod array It should be return json response
    isValidHttpMethod(requestMethod) {

        const arrayOfHttpMethods = [
            'GET',
            'PUT',
            'POST',
            'PATCH',
            'DELETE'
        ];

        return arrayOfHttpMethods.includes(requestMethod);
    },


    // The verify jwt and check jwt expired time
    getJwtVerify(token, cb) {
        try {
            jwt.verify(token, process.env.PUBLIC_KEY, {}, (err, decoded) => {

                if (err !== null && err instanceof TokenExpiredError) {
                    cb('TOKEN_EXP');
                    return Json.builder(Response.HTTP_UNAUTHORIZED_TOKEN_EXP);
                }

                if (err instanceof JsonWebTokenError) {
                    cb('IN_VALID_TOKEN');
                    return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_TOKEN);
                }

                cb(decoded);
            });
        } catch (e) {
            ValidationException(e);
        }
    },


    // The jwt decrypt with JWK library and return jwt
    async getJwtDecrypt(encryptedBody) {
        try {
            let keystore = JWK.createKeyStore();
            await keystore.add(await JWK.asKey(process.env.JWE_PRAIVATE_KEY, 'pem'));
            let outPut = parse.compact(encryptedBody);
            let decryptedVal = await outPut.perform(keystore);
            let token = Buffer.from(decryptedVal.plaintext).toString();

            if (typeof decryptedVal.plaintext === ('undefined' || null))
                return Json.builder(Response.HTTP_UNAUTHORIZED_INVALID_TOKEN);

            return token.replace(/["]+/g, '');

        } catch (e) {
            ValidationException(e);
        }
    },


    // Returns split jwt without bearer
    getSplitBearerJwt(bearerHeader) {
        try {
            let token = bearerHeader.split(' ')[1];
            if ((token !== null || typeof token !== 'undefined')
                && typeof bearerHeader !== 'undefined')
                return token;
            return false;
        } catch (e) {
            ValidationException(e);
        }
    }

}