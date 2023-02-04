import config from 'config';
import io from "socket.io-client";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const getInStorage = key => cookies.get(key);

export default class {

    socket;

    constructor(endPoint) {
        this.socket = io(`${config.url.socket}${endPoint}`, {
            query: {
                apiKey: getInStorage('apiKey')
            },
            extraHeaders: {
                authorization: `Bearer ${getInStorage('accessToken')}`
            }
        });
    }

}