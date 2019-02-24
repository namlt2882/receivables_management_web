import * as Types from '../actions/action-type';

export const profiles = (state = [], action) => {
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

export const messageForms = (state = [], { type, messageForms }) => {
    switch (type) {
        case Types.FETCH_PROFILE_MESSAGE_FORMS:
            state = messageForms;
            return state;
        default: return state;
    }
}
