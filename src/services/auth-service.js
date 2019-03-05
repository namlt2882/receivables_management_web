import { Request, AuthRequest } from '../utils/request'

export const isLoggedIn = (yes, no) => {
    let token = localStorage.getItem('access_token');
    if (token === undefined || token === null) {
        removeJwt();
        no();
    } else {
        yes();
        // let res = AuthService.getUserInfo()
        //     .then(res => {
        //         console.log(res);
        //         yes();
        //     }).catch((err) => {
        //         result = false;
        //         if (err.response) {
        //             console.log(err.response.status);
        //         }
        //         removeJwt();
        //         no();
        //     });
    }
}

const removeJwt = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
}

export const AuthService = {
    login: (username, password) => {
        return Request().post('Auth/Login', {
            'UserName': username,
            'Password': password
        }).then(res => {
            let token = res.data.access_token;
            let role = res.data.role;
            let username = res.data.username;
            localStorage.setItem('access_token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('username', username);
        });
    },
    getUserInfo: () => {
        let username = localStorage.getItem('username');
        return AuthRequest.get(`User/GetByUsername?username=${username}`);
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        window.location.href = '/login'
    },
    isCollector() {
        return localStorage.getItem('role') === 'Collector';
    },
    isManager() {
        return localStorage.getItem('role') === 'Manager';
    }
}