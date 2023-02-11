import {RoomMessage} from "../module/base/dto/RoomMessage";
import {PersonalMessage} from "../module/base/dto/PersonalMessage";
import {TE2EMessage} from "../module/base/dto/TE2EMessage";

type JsonObject = { [key: string]: any }
type TToken = { accessToken: string, refreshToken: string }
type TTokenWithApiKey = { accessToken: string, refreshToken: string, apiKey: string }

type IResponse = { statusCode: number, message: string }

type FileUploaded = {
    url: string
    size: string
}

type RoomId = {
    type: string,
    id: string
}

type Activities = {
    type: string // 'all' | 'group' | 'channel' | 'e2e'
}

type IFile = {
    size: number,
    buffer: ArrayBuffer,
    name: string
}

type TUserDeviceInfo = {
    ip: string,
    id?: string,
    name: string,
    location: string
}

type MessagePayload = {
    file: IFile,
    tableName: string,
    message: RoomMessage | PersonalMessage | TE2EMessage
}

type TSaveMessage = {
    tableName: string
    message: JsonObject
}

type ListOfUserTargetId = Array<{
    userTargetId: string
}>

type ListOfAdmin = Array<{
    adminId: string
}>

type ListOfUserId = Array<{
    userId: string
}>

type ListOfGroupId = Array<{
    groupId: string
}>

type ListOfChannelId = Array<{
    channelId: string
}>

type ListOfUserTableChat = Array<{
    tblChatId: string
}>

type AuthMsgBelongingToBetweenTwoUsers = {
    fromUser: string,
    toUser: string
}

type UserIdWithType = {
    id: string,
    type: string
}

type ListOfIdWithType = Array<{
    id: string,
    type: string // room type for example : channel, group, e2e, personal
}>

type HasOwner = 0 | 1;

export {
    MessagePayload,
    Activities,
    FileUploaded,
    ListOfUserTargetId,
    HasOwner,
    ListOfChannelId,
    ListOfGroupId,
    ListOfUserId,
    IResponse,
    TToken,
    RoomId,
    UserIdWithType,
    ListOfAdmin,
    TUserDeviceInfo,
    TTokenWithApiKey,
    TSaveMessage,
    ListOfIdWithType,
    ListOfUserTableChat,
    AuthMsgBelongingToBetweenTwoUsers,
    JsonObject
}