let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb://${process.env.HOST}:${process.env.MONGO_PORT}/${process.env.DATABASE}`);

module.exports = {

    model(obj, name) {

        let objSchema = new Schema(obj);

        return mongoose.model(name, objSchema);

    }

}