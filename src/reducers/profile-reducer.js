import * as Types from '../actions/action-type';

export const profiles = (state = [], action) => {
    switch (action.type) {
        case Types.SET_PROFILE_LIST:
            state = action.profiles;
            return state;
        default: return state;
    }
};

export const messageForms = (state = [], { type, messageForms }) => {
    switch (type) {
        case Types.SET_MESSAGE_LIST:
            state = messageForms;
            return state;
        default: return state;
    }
}
