let fs = require('fs'),
    {getFileHashName} = require('app/util/Generate'),
    Util = require('app/util/Util'),
    dotenv = require('dotenv'),
    {
        FileException
    } = require('app/exception/FileException');

dotenv.config();

module.exports = {


    validationAndWriteFile(dataBinary, fileType) {

        const IMAGE_VALIDA_TYPE = [
                '.png',
                '.jpg',
                '.gif',
                '.jpeg',
                '.webp',
                '.bmp'
            ],
            VIDEO_VALIDA_TYPE = [
                '.mp4',
                '.mkv'
            ],
            AUDIO_VALIDA_TYPE = [
                '.mp3',
                '.m4a',
                '.ogg'
            ],
            ROOT_PROJECT_FOLDER = '../';


        let url = `http://${process.env.IP}`,
            fileFormat = fileType.toLowerCase(),
            randomFileName = getFileHashName(),
            getFileData = (pathDir) => {
                try {
                    pathDir = 'cache/' + pathDir + randomFileName + fileFormat;
                    fs.writeFileSync(ROOT_PROJECT_FOLDER + pathDir, dataBinary);

                    const BYTE_SIZE_FOR_FILE = fs.statSync(ROOT_PROJECT_FOLDER + pathDir).size,
                        FILE_SIZE = Util.formatBytes(BYTE_SIZE_FOR_FILE);

                    return {
                        fileUrl: url + '/' + pathDir,
                        fileSize: FILE_SIZE
                    };
                } catch (e) {
                    FileException(e);
                }
            },
            isAudio = AUDIO_VALIDA_TYPE.includes(fileFormat),
            isVideo = VIDEO_VALIDA_TYPE.includes(fileFormat),
            isImage = IMAGE_VALIDA_TYPE.includes(fileFormat);


        if (isImage)
            return getFileData(`img/`);


        if (isVideo)
            return getFileData(`video/`);


        if (isAudio)
            return getFileData(`voice/`);

        return getFileData(`docs/`);
    }


}