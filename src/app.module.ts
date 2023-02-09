import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {RouterModule} from "@nestjs/core";
import {GenerateUserModule} from "./module/user/gen/GenerateUser.module";
import {TwoStepModule} from "./module/user/twoStep/TwoStep.module";
import {VerifyOTPModule} from "./module/user/autoCode/VerifyOTP.module";
import {RefreshTokenModule} from "./module/user/refresh/RefreshToken.module";
import {E2EBlockUserModule} from "./module/e2e/block/E2EBlockUser.module";
import {E2EUploadFileModule} from "./module/e2e/upload/E2EUploadFile.module";
import {E2EChatsModule} from "./module/e2e/chats/E2EChats.module";
import {E2EUserInfoModule} from "./module/e2e/info/E2EUserInfo.module";
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
import {GroupUploadFileModule} from "./module/group/upload/file/GroupUploadFile.module";
import {GroupUploadAvatarModule} from "./module/group/upload/avatar/GroupUploadAvatar.module";
import {GroupNameModule} from "./module/group/name/GroupName.module";
import {GroupDescriptionModule} from "./module/group/description/GroupDescription.module";
import {GroupLinkModule} from "./module/group/link/GroupLink.module";
import {GroupUserModule} from "./module/group/user/GroupUser.module";
import {GroupInfoModule} from "./module/group/info/GroupInfo.module";
import {GroupChatsModule} from "./module/group/chats/GroupChats.module";
import {GroupAdminModule} from "./module/group/admin/GroupAdmin.module";
import {ChannelUploadFileModule} from "./module/channel/upload/file/ChannelUploadFile.module";
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
import {UserProfileModule} from "./module/user/profile/UserProfile.module";
import {LoggerMiddleware} from "./LoggerMiddleware";
import {GroupModule} from "./module/group/Group.module";
import {ChannelModule} from "./module/channel/Channel.module";
import {E2EModule} from "./module/e2e/E2E.module";
import {RoomsModule} from "./module/common/rooms/Rooms.module";

@Module({
    imports: [

        // Auth module
        GenerateUserModule,
        TwoStepModule,
        VerifyOTPModule,
        RefreshTokenModule,
        UserProfileModule,

        // E2E module
        E2EModule,
        E2EBlockUserModule,
        E2EUploadFileModule,
        E2EUserInfoModule,
        E2EChatsModule,

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
        GroupModule,
        GroupUploadFileModule,
        GroupNameModule,
        GroupDescriptionModule,
        GroupUploadAvatarModule,
        GroupLinkModule,
        GroupAdminModule,
        GroupChatsModule,
        GroupInfoModule,
        GroupUserModule,

        // Channel module
        ChannelModule,
        ChannelUploadFileModule,
        ChannelNameModule,
        ChannelDescriptionModule,
        ChannelUploadAvatarModule,
        ChannelLinkModule,
        ChannelAdminModule,
        ChannelChatsModule,
        ChannelInfoModule,
        ChannelUserModule,

        // Common module
        ContentSearchModule,
        RoomsModule,

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
                            },
                            {
                                path: "profile/name",
                                module: UserProfileModule
                            }
                        ]
                    },

                    // End to End private message (PV)
                    {
                        path: "e2e",
                        module: E2EModule,
                        children: [
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
                        module: GroupModule,
                        children: [
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
                        module: ChannelModule,
                        children: [
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
                            },
                            {
                                path: "rooms",
                                module: RoomsModule
                            }
                        ]
                    }

                ]
            }
        ])
    ],
    // Socket.io
    providers: [ChannelController, E2EController, GroupController]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
