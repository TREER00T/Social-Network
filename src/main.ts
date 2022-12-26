import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import Res from "./util/Response";
import { NextFunction, Request, Response } from "express";
import Validation from "./util/Validation";
import Util from "./util/Util";
import { SocketIoAdapter } from "./io/adapter";
import Json from "./util/ReturnJson";
import Swagger from "../docs/swagger";

async function bootstrap() {

  dotenv.config();
  const app = await NestFactory.create(AppModule, { bodyParser: true, rawBody: true, cors: true });

  Swagger.restApi(app);
  Swagger.socketIo();

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  app.use(async (req: Request, res: Response, next: NextFunction) => {

    Json.initializationRes(res);

    if (Validation.requestEndpointHandler(req.url) === "AuthRoute") {
      let token,
        apiKey;
      try {
        token = req.headers?.authorization;
        apiKey = req.headers?.apiKey ? req.headers?.apiKey : req.query?.apiKey;
      } catch (e) {
      }
      let isAccessTokenVerify = Util.tokenVerify(token);


      let isSetUserToken = !isAccessTokenVerify ? isAccessTokenVerify : await Util.tokenVerify(token);
      let isSetUserApiKey = Util.isSetUserApiKey(apiKey);

      if (!isSetUserApiKey || !isSetUserToken)
        return Json.builder(Res.HTTP_UNAUTHORIZED_INVALID_TOKEN);

      let data = await Util.getTokenPayLoad();
      let result = await Util.isValidApiKey(apiKey, data.phoneNumber);

      if (!result)
        return Json.builder(Res.HTTP_UNAUTHORIZED_INVALID_API_KEY);

      next();
    }

    next();

  });

  await app.listen(process.env.EXPRESS_PORT);
}

bootstrap();
