import {SwaggerModule} from "@nestjs/swagger";
import * as YAML from "yamljs";
import * as openrtp from "openrtp";


export default {
    restApi(app) {
        SwaggerModule.setup("apiDocs", app, YAML.load("./docs/yaml/restApi.yaml"));
    },

    socketIo() {
        openrtp.setup({
            fileLocation: "./docs/yaml/openRTP.yaml"
        });
    }
};