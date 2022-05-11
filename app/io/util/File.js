let fs = require('fs'),
    Generate = require('app/util/Generate'),
    Util = require('app/util/util'),
    dotenv = require('dotenv'),
    {
        FileException
    } = require('app/exception/FileException');

dotenv.config();

module.exports = {


    decodeAndWriteFile(dataBinary, fileType, socket, docsFormat) {

        const PNG = '.png',
            MP4 = '.mp4',
            MP3 = '.mp3',
            IMAGE = 'Image',
            VIDEO = 'Video',
            VOICE = 'Voice',
            DOCUMENT = 'Document',
            defaultFormat = '.pdf',
            ROOT_PROJECT_FOLDER = '../';


        let pathDir = 'cache/',
            jsonObject,
            url = `http://${process.env.IP}`,
            randomFileName = Generate.getFileHashName();


        if (docsFormat === undefined)
            docsFormat = defaultFormat;


        if (fileType === IMAGE)
            pathDir += `img/${randomFileName + PNG}`;


        if (fileType === DOCUMENT)
            pathDir += `docs/${randomFileName + docsFormat}`;


        if (fileType === VIDEO)
            pathDir += `video/${randomFileName + MP4}`;


        if (fileType === VOICE)
            pathDir += `voice/${randomFileName + MP3}`;


        try {
            fs.writeFileSync(ROOT_PROJECT_FOLDER + pathDir, dataBinary);
            fs.readFile(ROOT_PROJECT_FOLDER + pathDir, function (error, data) {

                let dataBase64 = Buffer.from(data).toString('base64');
                socket.write(dataBase64);

                const byteSize = fs.statSync(ROOT_PROJECT_FOLDER + pathDir).size;
                const fileSize = Util.formatBytes(byteSize);
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