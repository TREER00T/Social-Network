import config from 'config';
import io from "socket.io-client";

const getInStorage = key => localStorage.getItem(key);

export default class {

    socket;

    constructor(endPoint) {
        this.socket = io(`${config.url.socket}${endPoint}`, {
            query: {
                apiKey: getInStorage('apiKey') ?? 'gImhIN1yIOuG55bTvkCWsPEtkPjAWjT4BWRLE1txM2Lx4I0CAv'
            },
            extraHeaders: {
                authorization: `Bearer ${getInStorage('accessToken') ?? 'eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00iLCJraWQiOiJ4QzBCY0FKWDFSbVdQcGtIVmU2NmgwbTJLbUpOTHpfSU5ldVFvTWNzeE5VIn0.NBiWmLjcc2UnLnDi-JuEtCwF8-ZiZljzL7o-Kzpc7ZvN4YSA-Oqnn-TdIoTiTJUBa97M8Pxy1u8A0H0PUW2ad9MxyZf5SmXxwABw5VCbRC2tGtZqOmKHFs-WIL6en6Z4Z6P1MjUYA3DKYLYv0JVffgdi-FVa02p8EtS14D6q5a3OyD9Y_FSD2fFt241O1APFaBWNQ-EenGIlKF72uvOEN7fom7koullPKuwDr-l42xX821VGh961Ok7MYMCiZslnEcyOq_QQTh-Kn15izxinjESHynYJLVXmdQvgXkpObhyscXWMKvuTCZcx5S6bWHda5zMhRk3RAgdChVxiN_yEVg.JMgY9j7l9oV0UQnR.NPP5qAhYNgzZGE96GXby2IqIk8EX9XfXIbQJFF-_WG9UO_G5YBRM2WzkQLYxlNW21sVq5gscqR8d08mwM9ndrp31KUzz_bUHqa5Ig8qx6kb9CkcSJVh1WJgbo7sINcjUc5NmpFqATF8fSLaRSswjH-LbczDZ04ZNsrPwY5YvS7uF_zR1XRpLyTdHe4ml5aShSzaq5Jdjng4ktlORw4_Z6UqR0qvSMCyWnFNLS_zW3bvk_LyTt1ZhWkf9QtBZ2Xe3O7e27bPTGMSYGe2IAaI83bzjvjw8Yj201nRHS3G-3qXFyDUHGl9EeyBDhV3tEDtj0mHR42CXwLSe4AN8bM8OxlvIRe1PaiyEmp9qLFdSu3xZNwNkRMO4QvfOo_PogRuZeuIMl6agNu5_kfK7dhyJXAwUKbRliq0qcEKoeNJpqwId047H6pQ8t829BNlQDINThD2fl_NuMkW9pzxdPUsaCW74kZqvZXvrZHWXWCE58xoZKxMIgRxffHMyMp1v6bghy40yBsWmhMvYRpc3IX3s5nGayut3gzcEdga_uqiA3GayPWlJpLap1x4z9R0YYowZpB0eWxla2oBAxjJJhBWc6f6uh262L9TBNcxce0gP_Ym89S8hUoyqRehZSiq-sbWj1XoDiTy6tl1vnhvKpVpZoJ-M3nH2nelEOhTMZAbxEhff6yd3k0o6Fe3i1hK6gf2nhYDf4aG8XiM0hdIihSvX1IiHDw8vxccHwva8VutnJD9DGCtIehle709_gbsYcwE8JmLay9PetcL1nuhHdmAueXcJqdbmLoQ8J-5h1oWN5dIgrqumv4bJPB56EU-He5f-sW6_d7NmtyHOQ1OFzv82JFqFYAWReSpXomDajQ60IW-Wlz_XMCBq6_krDjp55q95ivFlwykxFFggpxtsm9oTiSTYEHJXa6N3Or8aPCZbut94HfVWmUWgHkl5nECkz7NxBYcgnSRvBW2Z_R68sZsWMOpvwU93LC_hE2i30EGMvXTsOrbeydoLrxbX302EW3uCuWEdxc52uQhFpKoEwZrS6vUosJcb2cRFe6AOxvh64G3DxLrviVrevjlgDKywBppmxE4IeqHjS_zLRBxECl-qOJsjQRg-GCxPBnN_MANqZVZLVxPcqEZt36FIgUPqBfphGqreT7kqlOPJQqPwdKVEYxApN09ybhLjKbgm1PM_m7eBVVzU8JeFVcM2Uyv_TQ0YPauK3rBjozGZqQ.JKGvXlUlesr6GdSAnpj8vw'}`
            }
        });
    }

}