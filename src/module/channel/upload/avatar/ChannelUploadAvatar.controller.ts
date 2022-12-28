import {Controller, Put} from '@nestjs/common';
import {ChannelUploadAvatarService} from './ChannelUploadAvatar.service';

@Controller()
export class ChannelUploadAvatarController {
    constructor(private readonly appService: ChannelUploadAvatarService) {
    }

    @Put()
    async save() {

    }
}
