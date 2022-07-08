require('app-module-path').addPath(__dirname);
require('app/io/connect/socket');
let Router = require('app/middleware/RouterInterface'),
    Database = require('app/database/DatabaseInterface');


Router.initialization();
Database.initialization();