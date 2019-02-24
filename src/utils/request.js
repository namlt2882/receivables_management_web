import Axios from "axios";
import { HOST_NAME } from "../constants/config";

export const Request = () => {
    return Axios.create({
        baseURL: HOST_NAME
    })
}

const getToken = () => {
    let token = localStorage.getItem('access_token');
    return 'Bearer ' + token;
}

const getAuthConfig = () => {
    let config = {
        headers: {
            Authorization: getToken(),
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Headers': '*',
            // 'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS'
        }
    }
    return config;
}

export const AuthRequest = {
    post(URL, data) {
        let config = getAuthConfig();
        return Request().post(URL, data, config);
    },
    get(URL) {
        let config = getAuthConfig();
        return Request().get(URL, config);
    },
    put(URL, data) {
        let config = getAuthConfig();
        return Request().put(URL, data, config);
    },
    delete(URL) {
        let config = getAuthConfig();
        return Request().delete(URL, config);
    }
}