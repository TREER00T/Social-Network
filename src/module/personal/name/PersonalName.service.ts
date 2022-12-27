import {Injectable} from '@nestjs/common';
import {PersonalNameDto} from "./PersonalName.dto";

let Update = require("../../../model/update/user");

@Injectable()
export class PersonalNameService {
    async updateFirstNameOrLastName(userPhone: string, dto: PersonalNameDto) {
        return await Update.name(userPhone, dto.firstName, dto.lastName);
    }
}
