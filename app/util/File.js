let fs = require('fs'),
    Generate = require('app/util/Generate'),
    Util = require('app/util/util'),
    dotenv = require('dotenv'),
    {
        FileException
    } = require('app/exception/FileException');

dotenv.config();

module.exports = {


    decodeAndWriteFile(dataBinary, fileType) {

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
            fs.writeFileSync(ROOT_PROJECT_FOLDER + pathDir, dataBinary );

            fs.readFile(ROOT_PROJECT_FOLDER + pathDir, () => {

                const byteSize = fs.statSync(ROOT_PROJECT_FOLDER + pathDir).size,
                    fileSize = Util.formatBytes(byteSize);

                jsonObject = {
                    fileSize: fileSize
                };

            });

        } catch (e) {
            FileException(e);
        }

        return jsonObject = {
            fileUrl: url + '/' + pathDir
        };

    }


}