import {Controller, Put} from '@nestjs/common';
import {GroupUploadAvatarService} from './GroupUploadAvatar.service';

@Controller()
export class GroupUploadAvatarController {
    constructor(private readonly appService: GroupUploadAvatarService) {
    }

    @Put()
    async save() {

    }
}
