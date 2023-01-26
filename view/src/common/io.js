import config from 'config';
import io from "socket.io-client";

const getInStorage = key => localStorage.getItem(key);

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