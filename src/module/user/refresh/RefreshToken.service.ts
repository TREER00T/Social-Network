import {Injectable} from '@nestjs/common';
import Find from "../../../model/find/user";

@Injectable()
export class RefreshTokenService {
    async isExistUser(userPhone: string): Promise<boolean> {
        return await Find.userPhone(userPhone);
    }
}
