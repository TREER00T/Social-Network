let Influx = require('../database/influxDbDriver');

export function FileException(error) {
    Influx.writeInStringField('file_exception', error);
}