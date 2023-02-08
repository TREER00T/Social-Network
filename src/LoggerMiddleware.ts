import {Injectable, NestMiddleware} from "@nestjs/common";
import Json from "./util/ReturnJson";
import Validation from "./util/Validation";
import Util from "./util/Util";
import Res from "./util/Response";
import {NextFunction, Request, Response} from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    async use(req: Request, res: Response, next: NextFunction) {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'x-api-key, content-type, content-length, authorization',
        });

        Json.initializationRes(res);

        let reqResult = Validation.requestEndpointHandler(req.originalUrl);
        if (reqResult) {
            let token = req.headers?.authorization,
                apiKey = req.headers?.['x-api-key']?.toString();


            let tokenPayload = await Util.tokenVerify(token, res);

            if (!tokenPayload && reqResult === 'RequireJwtToken') {
                res.send(Res.HTTP_UNAUTHORIZED_INVALID_TOKEN);
                return Json.builder(Res.HTTP_UNAUTHORIZED_INVALID_TOKEN);
            }

            if (reqResult === 'RequireJwtTokenAndApiKey') {
                let isValidApiKey = await Util.isValidApiKey(tokenPayload.phoneNumber, apiKey);

                if (!isValidApiKey) {
                    res.send(Res.HTTP_UNAUTHORIZED_INVALID_API_KEY);
                    return Json.builder(Res.HTTP_UNAUTHORIZED_INVALID_API_KEY);
                }

            }

            next();
        } else
            next();
    }

}