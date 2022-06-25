const {
    COMMA,
    POINT,
} = require('app/database/util/KeywordHelper');




module.exports = {


    POINT(Lat, Lon) {
        return `${POINT}(${Lat} ${Lon})`;
    },

    fieldPoint(field){
        return `X(${field}) AS Lat ${COMMA} Y(${field}) AS Lon`;
    }

}