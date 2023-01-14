let Influx = require('../database/influxDbDriver');

export function ValidationException(error) {
    Influx.writeInStringField('validation_exception', error);
}