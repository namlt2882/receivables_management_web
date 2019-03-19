import * as Types from './action-type';
import { callApi } from '../utils/api-caller';

// Gọi lên API để lấy dữ liệu về lưu vào store
export const actFetchUsersRequest = () => {
    return (dispatch) => {
        return callApi('users', 'GET', null).then(res => {
            dispatch(actFetchUsers(res.data))
        });
    };
}
export const actFetchUsers = (users) => {
    return {
        type : Types.FETCH_USERS,
        users
    }
}

// Gọi lên API để lấy id của một user cần xóa
export const actDeleteUsersRequest = (id) => {
    return (dispatch) => {
        return callApi(`users/${id}`, 'DELETE', null).then(res => {
            dispatch(actDeleteUsers(id))
        });
    };
}
export const actDeleteUsers = (id) => {
    return {
        type : Types.DELETE_USER,
        id
    }
}

// thêm user
export const actAddUsersRequest = (user) => {
    return (dispatch) => {
        return callApi('users', 'POST', user).then(res => {
            dispatch(actAddUsers(res.data))
        });
    };
}
export const actAddUsers = (user) => {
    return {
        type : Types.ADD_USER,
        user
    }
}

// Edit User
export const actGetUserRequest = (id) => {
    return (dispatch) => {
        return callApi(`users/${id}`, 'GET', null).then(res => {
            dispatch(actGetUser(res.data));
        });
    };
}
export const actGetUser = (user) => {
    return {
        type : Types.EDIT_USER,
        user
    }
}

// Update User
export const actUpdateUserRequest = (user) => {
    return (dispatch) => {
        return callApi(`users/${user.id}`, 'PUT', user).then(res => {
            dispatch(actUpdateUser(res.data));
        });
    };
}
export const actUpdateUser = (user) => {
    return {
        type : Types.UPDATE_USER,
        user
    }
}

// Filter table
export const actFilter = (filter) => {
    return {
        type : Types.FILTER_TABLE,
        filter // Bao gồm filterName và filterStatus
    }
}

// Sort table
export const actSort = (sort) => {
    return {
        type : Types.SORT_TABLE,
        sort // Bao gồm sortBy và sortValue
    }
}

export const UserAction = {
    setUsers: (users) => {
        return {
            type: Types.FETCH_USERS,
            users
        }
    },
    setUser: (user) => {
        return {
            type: Types.FETCH_USER,
            user
        }
    }
}