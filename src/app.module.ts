import {Module} from "@nestjs/common";
import {RouterModule} from "@nestjs/core";
import {GenerateUserModule} from "./module/user/gen/GenerateUser.module";
import {TwoStepModule} from "./module/user/twoStep/TwoStep.module";
import {VerifyOTPModule} from "./module/user/autoCode/VerifyOTP.module";
import {RefreshTokenModule} from "./module/user/refresh/RefreshToken.module";
import {E2ECreateRoomModule} from "./module/e2e/create/E2ECreateRoom.module";
import {E2EBlockUserModule} from "./module/e2e/block/E2EBlockUser.module";
import {E2EUploadFileModule} from "./module/e2e/upload/E2EUploadFile.module";
import {E2EChatsModule} from "./module/e2e/chats/E2EChats.module";
import {E2EUserInfoModule} from "./module/e2e/info/E2EUserInfo.module";
import {E2EDeleteChatModule} from "./module/e2e/delete/E2EDeleteChat.module";
import {PersonalUserInfoModule} from "./module/personal/info/PersonalUserInfo.module";
import {PersonalUsernameModule} from "./module/personal/username/PersonalUsername.module";
import {PersonalBioModule} from "./module/personal/bio/PersonalBio.module";
import {PersonalNameModule} from "./module/personal/name/PersonalName.module";
import {PersonalAuthModule} from "./module/personal/auth/PersonalAuth.module";
import {PersonalUploadAvatarModule} from "./module/personal/upload/avatar/PersonalUploadAvatar.module";
import {PersonalUserBlocksModule} from "./module/personal/block/PersonalUserBlocks.module";
import {PersonalDevicesModule} from "./module/personal/device/PersonalDevices.module";
import {SavedMessageModule} from "./module/personal/savedMessage/SavedMessage.module";
import {PersonalAccountModule} from "./module/personal/account/PersonalAccount.module";
import {PersonalMessageModule} from "./module/personal/message/PersonalMessage.module";
import {PersonalUploadFileModule} from "./module/personal/upload/file/PersonalUploadFile.module";
import {CreateGroupModule} from "./module/group/create/CreateGroup.module";
import {GroupUploadFileModule} from "./module/group/upload/file/GroupUploadFile.module";
import {GroupUploadAvatarModule} from "./module/group/upload/avatar/GroupUploadAvatar.module";
import {DeleteGroupModule} from "./module/group/delete/DeleteGroup.module";
import {GroupNameModule} from "./module/group/name/GroupName.module";
import {GroupDescriptionModule} from "./module/group/description/GroupDescription.module";
import {GroupLinkModule} from "./module/group/link/GroupLink.module";
import {GroupUserModule} from "./module/group/user/GroupUser.module";
import {GroupInfoModule} from "./module/group/info/GroupInfo.module";
import {GroupChatsModule} from "./module/group/chats/GroupChats.module";
import {GroupAdminModule} from "./module/group/admin/GroupAdmin.module";
import {ChannelUploadFileModule} from "./module/channel/upload/file/ChannelUploadFile.module";
import {CreateChannelModule} from "./module/channel/create/CreateChannel.module";
import {DeleteChannelModule} from "./module/channel/delete/DeleteChannel.module";
import {ChannelNameModule} from "./module/channel/name/ChannelName.module";
import {ChannelDescriptionModule} from "./module/channel/description/ChannelDescription.module";
import {ChannelUploadAvatarModule} from "./module/channel/upload/avatar/ChannelUploadAvatar.module";
import {ChannelAdminModule} from "./module/channel/admin/ChannelAdmin.module";
import {ChannelChatsModule} from "./module/channel/chats/ChannelChats.module";
import {ChannelInfoModule} from "./module/channel/info/ChannelInfo.module";
import {ChannelUserModule} from "./module/channel/user/ChannelUser.module";
import {ContentSearchModule} from "./module/common/search/ContentSearch.module";
import {ChannelLinkModule} from "./module/channel/link/ChannelLink.module";
import {ChannelController} from "./io/channel/Channel.controller";
import {E2EController} from "./io/e2e/E2E.controller";
import {GroupController} from "./io/group/Group.controller";
import {CommonController} from "./io/common/Common.controller";

@Module({
    imports: [

        // Auth module
        GenerateUserModule,
        TwoStepModule,
        VerifyOTPModule,
        RefreshTokenModule,

        // E2E module
        E2ECreateRoomModule,
        E2EBlockUserModule,
        E2EUploadFileModule,
        E2EUserInfoModule,
        E2EChatsModule,
        E2EDeleteChatModule,

        // Personal module
        PersonalUserInfoModule,
        PersonalUsernameModule,
        PersonalBioModule,
        PersonalNameModule,
        PersonalAuthModule,
        PersonalUploadAvatarModule,
        PersonalUserBlocksModule,
        PersonalDevicesModule,
        SavedMessageModule,
        PersonalAccountModule,
        PersonalMessageModule,
        PersonalUploadFileModule,

        // Group module
        CreateGroupModule,
        GroupUploadFileModule,
        DeleteGroupModule,
        GroupNameModule,
        GroupDescriptionModule,
        GroupUploadAvatarModule,
        GroupLinkModule,
        GroupAdminModule,
        GroupChatsModule,
        GroupInfoModule,
        GroupUserModule,

        // Channel module
        CreateChannelModule,
        ChannelUploadFileModule,
        DeleteChannelModule,
        ChannelNameModule,
        ChannelDescriptionModule,
        ChannelUploadAvatarModule,
        ChannelLinkModule,
        ChannelAdminModule,
        ChannelChatsModule,
        ChannelInfoModule,
        ChannelUserModule,

        RouterModule.register([
            {
                path: "api/v1",
                children: [

                    // Authentication
                    {
                        path: "auth",
                        children: [
                            {
                                path: "generate/user",
                                module: GenerateUserModule
                            },
                            {
                                path: "refresh/token",
                                module: RefreshTokenModule
                            },
                            {
                                path: "verify",
                                children: [
                                    {
                                        path: "otp",
                                        module: VerifyOTPModule
                                    },
                                    {
                                        path: "twoStep",
                                        module: TwoStepModule
                                    }
                                ]
                            }
                        ]
                    },

                    // End to End private message (PV)
                    {
                        path: "e2e",
                        children: [
                            {
                                path: "/",
                                module: E2EDeleteChatModule
                            },
                            {
                                path: "create",
                                module: E2ECreateRoomModule
                            },
                            {
                                path: "uploadFile",
                                module: E2EUploadFileModule
                            },
                            {
                                path: "user",
                                children: [
                                    {
                                        path: "block",
                                        module: E2EBlockUserModule
                                    },
                                    {
                                        path: "info",
                                        module: E2EUserInfoModule
                                    }
                                ]
                            },
                            {
                                path: "chats",
                                module: E2EChatsModule
                            }
                        ]
                    },

                    // Personal configuration
                    {
                        path: "personal",
                        children: [
                            {
                                path: "user",
                                module: PersonalUserInfoModule
                            },
                            {
                                path: "username",
                                module: PersonalUsernameModule
                            },
                            {
                                path: "bio",
                                module: PersonalBioModule
                            },
                            {
                                path: "name",
                                module: PersonalNameModule
                            },
                            {
                                path: "twoAuth",
                                module: PersonalAuthModule
                            },
                            {
                                path: "blockUsers",
                                module: PersonalUserBlocksModule
                            },
                            {
                                path: "devices",
                                module: PersonalDevicesModule
                            },
                            {
                                path: "savedMessage",
                                module: SavedMessageModule
                            },
                            {
                                path: "account",
                                module: PersonalAccountModule
                            },
                            {
                                path: "message",
                                module: PersonalMessageModule
                            },
                            {
                                path: "upload",
                                children: [
                                    {
                                        path: "file",
                                        module: PersonalUploadFileModule
                                    },
                                    {
                                        path: "avatar",
                                        module: PersonalUploadAvatarModule
                                    }
                                ]
                            }
                        ]
                    },

                    // Group module
                    {
                        path: "group",
                        children: [
                            {
                                path: "create",
                                module: CreateGroupModule
                            },
                            {
                                path: "/",
                                module: DeleteGroupModule
                            },
                            {
                                path: "name",
                                module: GroupNameModule
                            },
                            {
                                path: "description",
                                module: GroupDescriptionModule
                            },
                            {
                                path: "upload",
                                children: [
                                    {
                                        path: "avatar",
                                        module: GroupUploadAvatarModule
                                    },
                                    {
                                        path: "file",
                                        module: GroupUploadFileModule
                                    }
                                ]
                            },
                            {
                                path: "link",
                                module: GroupLinkModule
                            },
                            {
                                path: "users",
                                module: GroupUserModule
                            },
                            {
                                path: "admins",
                                module: GroupAdminModule
                            },
                            {
                                path: "chats",
                                module: GroupChatsModule
                            },
                            {
                                path: "info",
                                module: GroupInfoModule
                            }
                        ]
                    },

                    // Channel module
                    {
                        path: "channel",
                        children: [
                            {
                                path: "create",
                                module: CreateChannelModule
                            },
                            {
                                path: "upload",
                                children: [
                                    {
                                        path: "file",
                                        module: ChannelUploadFileModule
                                    },
                                    {
                                        path: "avatar",
                                        module: ChannelUploadAvatarModule
                                    }
                                ]
                            },
                            {
                                path: "/",
                                module: DeleteChannelModule
                            },
                            {
                                path: "name",
                                module: ChannelNameModule
                            },
                            {
                                path: "description",
                                module: ChannelDescriptionModule
                            },
                            {
                                path: "link",
                                module: ChannelLinkModule
                            },
                            {
                                path: "users",
                                module: ChannelUserModule
                            },
                            {
                                path: "admins",
                                module: ChannelAdminModule
                            },
                            {
                                path: "chats",
                                module: ChannelChatsModule
                            },
                            {
                                path: "info",
                                module: ChannelInfoModule
                            }
                        ]
                    },

                    // Common module
                    {
                        path: "common",
                        children: [
                            {
                                path: "search",
                                module: ContentSearchModule
                            }
                        ]
                    }

                ]
            }
        ])
    ],
    // Socket.io
    providers: [ChannelController, E2EController, GroupController, CommonController]
})
export class AppModule {
}
