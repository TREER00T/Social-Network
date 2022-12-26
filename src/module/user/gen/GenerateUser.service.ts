import { Injectable } from "@nestjs/common";
import { GenerateUserDto } from "./GenerateUser.dto";
import Generate from "../../../util/Generate";
import Util from "../../../util/Util";

let Find = require("../../../model/find/user"),
  Insert = require("../../../model/add/user"),
  Update = require("../../../model/update/user"),
  CreateUser = require("../../../model/create/user");

@Injectable()
export class GenerateUserService {
  async generateUser(dto: GenerateUserDto): Promise<boolean> {

    let userPhone = dto.phone,
      isPhoneNumberInDb = await Find.userPhone(userPhone);

    if (!isPhoneNumberInDb) {
      await CreateUser.savedMessage(userPhone);

      await Insert.phoneAndAuthCode(userPhone, Generate.getVerificationCode(), Util.getRandomHexColor());

      return true;
    }

    await Update.authCode(userPhone, Generate.getVerificationCode());

    return false;

  }
}
