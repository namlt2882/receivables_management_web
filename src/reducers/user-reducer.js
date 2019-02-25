import * as Types from '../actions/action-type';

var initialState = [];

var findIndex = (users, id) => {
    var result = -1;
    users.forEach((user, index) => {
        if (user.id === id) {
            result = index;
        }
    });
    return result;
}

const users = (state = initialState, action) => {
    var index = -1;
    var { id, user } = action;
    switch (action.type) {
        case Types.FETCH_USERS:
            state = action.users;
            return [...state];
        case Types.DELETE_USER:
            index = findIndex(state, id);
            state.splice(index, id);
            return [...state];
        case Types.ADD_USER:
            state.push(action.user);
            return [...state];
        case Types.UPDATE_USER:
            index = findIndex(state, user.id);
            state[index] = user;
            return [...state];
        default: return [...state];
    }
};

export default users;