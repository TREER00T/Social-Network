import {Injectable} from '@nestjs/common';
import Delete from "../../../model/remove/user";
import Find from "../../../model/find/user";

@Injectable()
export class PersonalAccount {
    async deleteAccount(userPhone: string, userId: string) {
        await Delete.savedMessage(userPhone);
        await Delete.userInAllUsersBlockList(userId);
        await Delete.userInUsersTable(userId);
        await Delete.userInDevices(userId);

        await Find.getListOfUserE2Es(userId).then(async result => {
            if (result)
                await Delete.userInAllUsersE2E(result, userId);
        });

        await Find.getListOfUserJoinedGroup(userId).then(async result => {

            await Delete.userDataInJoinedGroups(result, userId);

        }).then(async () => {

            await Find.getListOfUserCreatedGroup(userId).then(async result => {
                if (result)
                    await Delete.userInAllUsersGroup(result, userId);
            });

        });

        await Find.getListOfUserJoinedChannel(userId).then(async result => {

            await Delete.userDataInJoinedChannels(result, userId);

        }).then(async () => {

            await Find.getListOfUserCreatedChannel(userId).then(async result => {
                if (result)
                    await Delete.userInAllUsersChannel(result, userId);
            });

        });
    }
}
