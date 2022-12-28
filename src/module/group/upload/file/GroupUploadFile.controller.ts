import {Controller, Post} from '@nestjs/common';
import {GroupUploadFileService} from './GroupUploadFile.service';

@Controller()
export class GroupUploadFileController {
    constructor(private readonly appService: GroupUploadFileService) {
    }

    @Post()
    async save() {

    }
}
