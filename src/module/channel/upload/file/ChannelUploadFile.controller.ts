import {Controller, Post} from '@nestjs/common';
import {ChannelUploadFileService} from './ChannelUploadFile.service';

@Controller()
export class ChannelUploadFileController {
    constructor(private readonly appService: ChannelUploadFileService) {
    }

    @Post()
    async save() {

    }
}
