let swaggerUI = require('swagger-ui-express'),
    YAML = require('yamljs'),
    swaggerJSDocs = YAML.load('./docs/yaml/restApi.yaml');


module.exports = {
    restApi(app) {
        app.use('/apiDocs', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));
    },

    socketIo() {

    }
}