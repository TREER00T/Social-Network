#!/usr/bin/env node
let {
        program
    } = require('commander'),
    Database = require('./app/database/DatabaseInterface'),
    File = require('./app/util/File');


program
    .command('serve')
    .description('Initialization server')
    .action(() => {
        Database.initialization(isErr => {

            if (isErr)
                return console.log('Database connect failed');

            Database.create(() => {
                console.log('Database Successfully Created.');
            });

        });

        File.mkdirForUploadFile();

    })
    .parse();