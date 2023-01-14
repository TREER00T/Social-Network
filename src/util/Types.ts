import {Message} from "../module/base/dto/Message";

type JsonObject = { [key: string]: any }
type Token = { accessToken: string, refreshToken: string }

type IResponse = { code: number, message: string }

type FileUploaded = {
    url: string
    size: string
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
    message: Message,
    conversationType: string
}

type TSaveMessage = {
    conversationType?: string,
    tableName: string
    message: JsonObject
}

type ListOfUserTargetId = Array<{
    userTargetId: string
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
    Token,
    TUserDeviceInfo,
    TSaveMessage,
    ListOfUserTableChat,
    AuthMsgBelongingToBetweenTwoUsers,
    JsonObject
}