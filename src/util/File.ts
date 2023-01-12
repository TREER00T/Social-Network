import * as fs from "fs";
import * as dotenv from "dotenv";
import Generate from "../util/Generate";
import Util from "../util/Util";
import {FileException} from "../exception/FileException";
import {FileUploaded} from "./Types";

dotenv.config();

let cacheFolder = "cache/",
    ROOT_PROJECT_FOLDER = "../",
    url = `${process.env.HTTP_TYPE}://${process.env.IP}`,
    cacheFolderPath = ROOT_PROJECT_FOLDER + cacheFolder;


export default {

    async validationAndWriteFile(obj): Promise<FileUploaded> {

        const IMAGE_VALIDA_TYPE = [
                ".png",
                ".jpg",
                ".gif",
                ".jpeg",
                ".webp",
                ".bmp"
            ],
            VIDEO_VALIDA_TYPE = [
                ".mp4",
                ".mkv"
            ],
            AUDIO_VALIDA_TYPE = [
                ".mp3",
                ".m4a",
                ".ogg"
            ];


        let fileFormat = obj.format.toLowerCase(),
            isAudio = AUDIO_VALIDA_TYPE.includes(fileFormat),
            isVideo = VIDEO_VALIDA_TYPE.includes(fileFormat),
            isImage = IMAGE_VALIDA_TYPE.includes(fileFormat);


        let fileConfig = {
            size: obj.size,
            format: obj.format,
            dataBinary: obj.dataBinary
        };

        if (isImage)
            return await this.getFileData({
                pathDir: `img/`,
                ...fileConfig
            });

        if (isVideo)
            return await this.getFileData({
                pathDir: `video/`,
                ...fileConfig
            });

        if (isAudio)
            return await this.getFileData({
                pathDir: `voice/`,
                ...fileConfig
            });

        return await this.getFileData({
            pathDir: `docs/`,
            ...fileConfig
        });
    },

    isExistFolder() {
        return fs.existsSync(cacheFolderPath);
    },


    async getFileData(obj): Promise<FileUploaded> {
        try {

            let randomFileName = Generate.getRandomHash(30),
                FILE_SIZE = Util.formatBytes(obj.size),
                pathDir = cacheFolder + obj.pathDir + randomFileName + obj.format;

            await fs.promises.writeFile(ROOT_PROJECT_FOLDER + pathDir, obj.dataBinary);

            return {
                url: url + "/" + pathDir,
                size: FILE_SIZE
            };
        } catch (e) {
            FileException(e);
        }
    },

    async mkdirForUploadFile() {
        let isExistFolder = this.isExistFolder();

        if (!isExistFolder) {
            await fs.promises.mkdir(cacheFolderPath, {recursive: true});

            for (const item of ["video", "voice", "img", "docs"])
                await fs.promises.mkdir(cacheFolderPath + item);


            await fs.promises.copyFile("config/.htaccess", cacheFolderPath + ".htaccess");
        }

        return !!isExistFolder;
    }

}