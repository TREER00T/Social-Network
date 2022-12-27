import {Injectable} from '@nestjs/common';

let Find = require("../../../model/find/user");

@Injectable()
export class PersonaDevicesService {
    async listOfDevices(userId: string) {
        return await Find.getListOfDevices(userId);
    }
}
