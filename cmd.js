#!/usr/bin/env node
require('app-module-path').addPath(__dirname);
let {
        program
    } = require('commander'),
    Database = require('app/database/DatabaseInterface');


program
    .command('db')
    .description('Create database and tables')
    .action(() => {
        Database.initialization(isConnect => {
            if (!isConnect)
                return console.log('Database connect failed');

            Database.create(() => {
                console.log('Database Successfully Created.');
            });

        });
    })
    .parse();