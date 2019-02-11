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
    switch (action.type) {
        case Types.FETCH_PROFILES:
            state = action.profiles;
            return state;
        // case Types.ADD_USER:
        //     state.push(action.user);
        //     return [...state];
        default: return state;
    }
};

export default profiles;