import * as Types from './../constants/ActionTypes';

// var findIndex = (profile, id) => {
//     var result = -1;
//     profile.forEach((user, index) => {
//         if (user.id === id) {
//             result = index;
//         }
//     });
//     return result;
// }

const profiles = (state = [], action) => {
    var index = -1;
    switch (action.type) {
        case Types.FETCH_PROFILES:
            state = action.profiles;
            return state;
        // case Types.DELETE_USER:
        //     index = findIndex(state, id);
        //     state.splice(index, id);
        //     return [...state];
        // case Types.ADD_USER:
        //     state.push(action.user);
        //     return [...state];
        // case Types.UPDATE_USER:
        //     index = findIndex(state, user.id);
        //     state[index] = user;
        //     return [...state];
        default: return state;
    }
};

export default profiles;