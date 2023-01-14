import Insert from "../../model/add/user";
import {TUserDeviceInfo} from "../../util/Types";

export default {

    async insert(userId: string, dto: TUserDeviceInfo) {
        await Insert.userDeviceInformation({
            id: userId,
            ...dto
        });
    }

}