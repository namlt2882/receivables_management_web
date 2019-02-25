import { Request, AuthRequest } from './../utils/request'

export const isLoggedIn = (yes, no) => {
    let token = localStorage.getItem('access_token');
    let result = true;
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
        return Request().post('auth/Login', {
            'username': username,
            'password': password
        });
    },
    getUserInfo: () => {
        return AuthRequest.get('auth/Info');
    }
}