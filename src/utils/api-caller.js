import axios from 'axios';
import * as Config from '../constants/config';

export function callApi (endpoint, method = 'GET', body) {
    return axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        data: body
    }).catch(err => {
        console.log(err);
    });
}

export function fetch (endpoint, method = 'GET', body) {
    return axios({
        method: method,
        url: `${Config.BASE_URL}/${endpoint}`,
        data: body
    }).catch(err => {
        console.log(err);
    });
}