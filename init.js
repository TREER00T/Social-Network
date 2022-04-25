require('app-module-path').addPath(__dirname);
let Database = require('app/database/DatabaseInterface'),
    Router = require('app/routes/RouterInterface');

Database.initialization();


Router.initialization();