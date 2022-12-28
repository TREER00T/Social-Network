import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GenerateUserModule } from "./module/user/gen/GenerateUser.module";
import { TwoStepModule } from "./module/user/twoStep/TwoStep.module";
import { VerifyAuthCodeModule } from "./module/user/autoCode/VerifyAuthCode.module";
import { RefreshTokenModule } from "./module/user/refresh/RefreshToken.module";
import { E2ECreateRoomModule } from "./module/e2e/create/E2ECreateRoom.module";
import { E2EBlockUserModule } from "./module/e2e/block/E2EBlockUser.module";
import { E2EUploadFileModule } from "./module/e2e/upload/E2EUploadFile.module";
import { E2EChatsModule } from "./module/e2e/chats/E2EChats.module";
import { E2EUserInfoModule } from "./module/e2e/info/E2EUserInfo.module";
import { E2EDeleteChatModule } from "./module/e2e/delete/E2EDeleteChat.module";
import { PersonalUserInfoModule } from "./module/personal/info/PersonalUserInfo.module";
import { PersonalUsernameModule } from "./module/personal/username/PersonalUsername.module";
import { PersonalBioModule } from "./module/personal/bio/PersonalBio.module";
import { PersonalNameModule } from "./module/personal/name/PersonalName.module";
import { PersonalAuthModule } from "./module/personal/auth/PersonalAuth.module";
import { PersonalUploadAvatarModule } from "./module/personal/upload/avatar/PersonalUploadAvatar.module";
import { PersonalUserBlocksModule } from "./module/personal/block/PersonalUserBlocks.module";
import { PersonaDevicesModule } from "./module/personal/device/PersonaDevices.module";
import { SavedMessageModule } from "./module/personal/savedMessage/SavedMessage.module";
import { PersonalAccountModule } from "./module/personal/account/PersonalAccount.module";
import { PersonalMessageModule } from "./module/personal/message/PersonalMessage.module";
import { PersonalUploadFileModule } from "./module/personal/upload/file/PersonalUploadFile.module";
import { CreateGroupModule } from "./module/group/create/CreateGroup.module";
import { GroupUploadFileModule } from "./module/group/upload/file/GroupUploadFile.module";
import { GroupUploadAvatarModule } from "./module/group/upload/avatar/GroupUploadAvatar.module";
import { DeleteGroupModule } from "./module/group/delete/DeleteGroup.module";
import { GroupNameModule } from "./module/group/name/GroupName.module";
import { GroupDescriptionModule } from "./module/group/description/GroupDescription.module";
import { GroupInviteLinkModule } from "./module/group/link/invite/GroupInviteLink.module";
import { GroupPublicLinkModule } from "./module/group/link/public/GroupPublicLink.module";
import { GroupUserJoinModule } from "./module/group/user/join/GroupUserJoin.module";
import { GroupUserLeaveModule } from "./module/group/user/leave/GroupUserLeave.module";
import { GroupUsersModule } from "./module/group/user/list/GroupUsers.module";
import { GroupInfoModule } from "./module/group/info/GroupInfo.module";
import { GroupChatsModule } from "./module/group/chats/GroupChats.module";
import { GroupAddAdminModule } from "./module/group/admin/add/GroupAddAdmin.module";
import { GroupRemoveAdminModule } from "./module/group/admin/remove/GroupRemoveAdmin.module";
import { ChannelUploadFileModule } from "./module/channel/upload/file/ChannelUploadFile.module";
import { CreateChannelModule } from "./module/channel/create/CreateChannel.module";
import { DeleteChannelModule } from "./module/channel/delete/DeleteChannel.module";
import { ChannelNameModule } from "./module/channel/name/ChannelName.module";
import { ChannelDescriptionModule } from "./module/channel/description/ChannelDescription.module";
import { ChannelUploadAvatarModule } from "./module/channel/upload/avatar/ChannelUploadAvatar.module";
import { ChannelInviteLinkModule } from "./module/channel/link/invite/ChannelInviteLink.module";
import { ChannelPublicLinkModule } from "./module/channel/link/public/ChannelPublicLink.module";
import { ChannelAddAdminModule } from "./module/channel/admin/add/ChannelAddAdmin.module";
import { ChannelRemoveAdminModule } from "./module/channel/admin/remove/ChannelRemoveAdmin.module";
import { ChannelUserJoinModule } from "./module/channel/user/join/ChannelUserJoin.module";
import { ChannelUserLeaveModule } from "./module/channel/user/leave/ChannelUserLeave.module";
import { ChannelChatsModule } from "./module/channel/chats/ChannelChats.module";
import { ChannelInfoModule } from "./module/channel/info/ChannelInfo.module";
import { ChannelUsersModule } from "./module/channel/user/list/ChannelUsers.module";
import { ContentSearchModule } from "./module/common/search/ContentSearch.module";
import { ChatGatewayModule } from "./io/chat/ChatGateway.module";

@Module({
  imports: [

    // Auth module
    GenerateUserModule,
    TwoStepModule,
    VerifyAuthCodeModule,
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
    PersonaDevicesModule,
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
    GroupInviteLinkModule,
    GroupPublicLinkModule,
    GroupAddAdminModule,
    GroupRemoveAdminModule,
    GroupUserJoinModule,
    GroupUserLeaveModule,
    GroupChatsModule,
    GroupInfoModule,
    GroupUsersModule,

    // Channel module
    CreateChannelModule,
    ChannelUploadFileModule,
    DeleteChannelModule,
    ChannelNameModule,
    ChannelDescriptionModule,
    ChannelUploadAvatarModule,
    ChannelInviteLinkModule,
    ChannelPublicLinkModule,
    ChannelAddAdminModule,
    ChannelRemoveAdminModule,
    ChannelUserJoinModule,
    ChannelUserLeaveModule,
    ChannelChatsModule,
    ChannelInfoModule,
    ChannelUsersModule,

    // Socket.io
    ChatGatewayModule,

    RouterModule.register([
      {
        path: "api",
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
                    path: "authCode",
                    module: VerifyAuthCodeModule
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
                path: "room",
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
                        path: "/info",
                        module: E2EUserInfoModule
                      }
                    ]
                  },
                  {
                    path: "chats",
                    module: E2EChatsModule
                  }
                ]
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
                path: "uploadAvatar",
                module: PersonalUploadAvatarModule
              },
              {
                path: "blockUsers",
                module: PersonalUserBlocksModule
              },
              {
                path: "devices",
                module: PersonaDevicesModule
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
                path: "uploadFile",
                module: PersonalUploadFileModule
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
                path: "uploadFile",
                module: GroupUploadFileModule
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
                path: "uploadAvatar",
                module: GroupUploadAvatarModule
              },
              {
                path: "link",
                children: [
                  {
                    path: "invite",
                    module: GroupInviteLinkModule
                  },
                  {
                    path: "public",
                    module: GroupPublicLinkModule
                  }
                ]
              },
              {
                path: "user",
                children: [
                  {
                    path: "join",
                    module: GroupUserJoinModule
                  },
                  {
                    path: "leave",
                    module: GroupUserLeaveModule
                  }
                ]
              },
              {
                path: "admin",
                children: [
                  {
                    path: "add",
                    module: GroupAddAdminModule
                  },
                  {
                    path: "remove",
                    module: GroupRemoveAdminModule
                  }
                ]
              },
              {
                path: "chats",
                module: GroupChatsModule
              },
              {
                path: "info",
                module: GroupInfoModule
              },
              {
                path: "users",
                module: GroupUsersModule
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
                path: "uploadFile",
                module: ChannelUploadFileModule
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
                path: "uploadAvatar",
                module: ChannelUploadAvatarModule
              },
              {
                path: "link",
                children: [
                  {
                    path: "invite",
                    module: ChannelInviteLinkModule
                  },
                  {
                    path: "public",
                    module: ChannelPublicLinkModule
                  }
                ]
              },
              {
                path: "user",
                children: [
                  {
                    path: "join",
                    module: ChannelUserJoinModule
                  },
                  {
                    path: "leave",
                    module: ChannelUserLeaveModule
                  }
                ]
              },
              {
                path: "admin",
                children: [
                  {
                    path: "add",
                    module: ChannelAddAdminModule
                  },
                  {
                    path: "remove",
                    module: ChannelRemoveAdminModule
                  }
                ]
              },
              {
                path: "chats",
                module: ChannelChatsModule
              },
              {
                path: "info",
                module: ChannelInfoModule
              },
              {
                path: "users",
                module: ChannelUsersModule
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
  ]
})
export class AppModule {
}
