let fs = require('fs'),
    Generate = require('app/util/Generate'),
    Util = require('app/util/Util'),
    dotenv = require('dotenv'),
    {
        FileException
    } = require('app/exception/FileException');

dotenv.config();

module.exports = {


    validationAndWriteFile(dataBinary, fileType) {

        const IMAGE = [
                '.png',
                '.jpg',
                '.gif',
                '.jpeg',
                '.webp',
                '.bmp'
            ],
            VIDEO = [
                '.mp4',
                '.mkv'
            ],
            AUDIO = [
                '.mp3',
                '.m4a',
                '.ogg'
            ],
            ROOT_PROJECT_FOLDER = '../';


        let pathDir = 'cache/',
            jsonObject,
            fileFormat = fileType.toLowerCase(),
            isAudio = AUDIO.includes(fileFormat),
            isVideo = VIDEO.includes(fileFormat),
            isImage = IMAGE.includes(fileFormat),
            url = `http://${process.env.IP}`,
            randomFileName = Generate.getFileHashName();


        if (isImage)
            pathDir += `img/${randomFileName + fileFormat}`;


        if (isVideo)
            pathDir += `video/${randomFileName + fileFormat}`;


        if (isAudio)
            pathDir += `voice/${randomFileName + fileFormat}`;


        if (!isAudio && !isVideo && !isImage)
            pathDir += `docs/${randomFileName + fileFormat}`;

        try {
            fs.writeFileSync(ROOT_PROJECT_FOLDER + pathDir, dataBinary);

            const byteSize = fs.statSync(ROOT_PROJECT_FOLDER + pathDir).size,
                fileSize = Util.formatBytes(byteSize);

            return jsonObject = {
                fileUrl: url + '/' + pathDir,
                fileSize: fileSize
            };
        } catch (e) {
            FileException(e);
        }


    }


}