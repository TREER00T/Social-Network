import Util from "../../util/Util";

export class UserTokenManager {

    userId: string;
    phoneNumber: string;

    async init() {
        let tokenPayload = await Util.getTokenPayLoad();
        this.userId = tokenPayload.id;
        this.phoneNumber = tokenPayload.phone;
    }

}