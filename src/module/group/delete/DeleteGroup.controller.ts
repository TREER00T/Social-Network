import {Controller, Delete, Param} from '@nestjs/common';
import {DeleteGroupService} from './DeleteGroup.service';

@Controller()
export class DeleteGroupController {
    constructor(private readonly appService: DeleteGroupService) {
    }

    @Delete()
    async removeGroup(@Param("groupId") groupId: string) {

    }
}
