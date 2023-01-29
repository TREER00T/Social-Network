import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";

@Injectable()
export class PersonalDevicesService {
    async listOfDevices(userId: string) {
        return await Find.getListOfDevices(userId);
    }
}
