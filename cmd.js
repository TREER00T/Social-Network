#!/usr/bin/env node
let {
        program
    } = require('commander'),
    Database = require('./app/database/DatabaseInterface'),
    File = require('./app/util/File');


program
    .command('serve')
    .description('Initialization server')
    .action(async () => {

        await Database.connect().then(async isErr => {
            if (isErr)
                return console.log('Database connect failed');

            await Database.createTable().then(() => console.log('Database Successfully Created.'));
        });

        await File.mkdirForUploadFile();

    })
    .parse();