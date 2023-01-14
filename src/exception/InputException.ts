let Influx = require('../database/influxDbDriver');

export function InputException(error) {
    Influx.writeInStringField('input_exception', error);
}