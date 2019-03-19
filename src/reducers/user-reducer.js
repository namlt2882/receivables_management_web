import * as Types from '../actions/action-type';


export const users = (state = [], action) => {
    switch (action.type) {
        case Types.FETCH_USERS:
            state = action.users;
            return state;
        case Types.FETCH_USER:
            state = action.user;
            return state;
        default: return state;
    }
};
