import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import * as dotenv from "dotenv";
import Swagger from "../docs/swagger";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {

    dotenv.config();
    const app = await NestFactory.create(AppModule, {
        bodyParser: true, rawBody: true, cors: true
    });

    Swagger.restApi(app);
    Swagger.socketIo();

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(process.env.EXPRESS_PORT);
}

bootstrap();