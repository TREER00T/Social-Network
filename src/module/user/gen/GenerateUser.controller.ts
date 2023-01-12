import {Body, Controller, Post} from "@nestjs/common";
import {GenerateUserService} from "./GenerateUser.service";
import {GenerateUserDto} from "./GenerateUser.dto";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";

@Controller()
export class GenerateUserController {
    constructor(private readonly appService: GenerateUserService) {
    }

    @Post()
    async generateUser(@Body() dto: GenerateUserDto) {
        let isNewUser = await this.appService.generateUser(dto);

        if (isNewUser)
            return Json.builder(Response.HTTP_CREATED);

        return Json.builder(Response.HTTP_OK);
    }
}
