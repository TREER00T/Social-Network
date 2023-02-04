import {Body, Controller, Put} from '@nestjs/common';
import {UserProfileService} from './UserProfile.service';
import {UserDto} from "./User.dto";
import Json from "../../../util/ReturnJson";
import Response from "../../../util/Response";
import {User} from "../../base/User";

@Controller()
export class UserProfileController extends User {
    constructor(private readonly appService: UserProfileService) {
        super();
    }

    @Put()
    async updateName(@Body() dto: UserDto) {
        await this.init();

        await this.appService.updateFirstAndLastName(this.phoneNumber, dto);

        return Json.builder(Response.HTTP_OK,
            await this.appService.getApiKey(this.phoneNumber));
    }

}
