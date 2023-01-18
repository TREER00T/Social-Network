require('dotenv').config();
const {InfluxDB, Point} = require('@influxdata/influxdb-client');

const token = process.env.INFLUX_DB_TOEKN;
const org = process.env.INFLUX_DB_ORG;
const bucket = process.env.INFLUX_DB_BUCKET;

const client = new InfluxDB({url: process.env.INFLUX_DB_URL, token: token});

const writeApi = client.getWriteApi(org, bucket);
writeApi.useDefaultTags({host: 'host1'});

module.exports = {

    writeInStringField(key, value) {
        const point = new Point('mem')
            .stringField(key, value);

        writeApi.writePoint(point);
    }

}