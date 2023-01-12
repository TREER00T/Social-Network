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

export {
    MessagePayload,
    Activities,
    FileUploaded,
    IResponse,
    Token,
    TSaveMessage,
    JsonObject
}