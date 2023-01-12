import Insert from "../../model/add/user";

export default {

    async insert(userId: string, dto: object) {
        await Insert.userDeviceInformation({
            id: userId,
            ...dto
        });
    }

}