import {Body, Controller, Delete, Get, Post, Query} from '@nestjs/common';
import {GroupUserService} from './GroupUser.service';
import Response from "../../../util/Response";
import Json from "../../../util/ReturnJson";
import PromiseVerify from "../../base/PromiseVerify";
import {Group} from "../../base/Group";
import {GroupUserDto} from "./GroupUser.dto";

@Controller()
export class GroupUserController extends Group {
    constructor(private readonly appService: GroupUserService) {
        super();
    }

    @Get()
    async listOfUsers(@Query("groupId") groupId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId)
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK,
            await this.appService.listOfUserWithDetails(
                await this.appService.listOfUser(groupId)));
    }

    @Get("/hasJoined")
    async hasJoinedInRoom(@Query() dto: GroupUserDto) {
        await this.init();
        let userId = dto?.userId ? dto.userId : this.userId;

        let haveErr = await PromiseVerify.all([
            this.verifyUser(userId),
            this.isGroupExist(dto.groupId),
            this.isUserJoined(dto.groupId, userId)
        ]);

        if (haveErr)
            return haveErr;

        return Json.builder(Response.HTTP_OK);
    }

    @Delete()
    async leaveUser(@Body("groupId") groupId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId)
        ]);

        if (haveErr)
            return haveErr;

        let isJoinedUser = await this.isNotJoinedUser(groupId);

        if (!isJoinedUser)
            return Json.builder(Response.HTTP_CONFLICT);

        await this.appService.leaveUser(groupId, this.userId);

        return Json.builder(Response.HTTP_OK);
    }

    @Post()
    async joinUser(@Body("groupId") groupId: string) {
        await this.init();

        let haveErr = await PromiseVerify.all([
            this.isUndefined(groupId)
        ]);

        if (haveErr)
            return haveErr;

        let isJoinedUser = await this.isNotJoinedUser(groupId);

        if (!isJoinedUser) {
            await this.appService.joinUser(groupId, this.userId);
            return Json.builder(Response.HTTP_CREATED);
        }

        return Json.builder(Response.HTTP_CONFLICT);
    }
}
