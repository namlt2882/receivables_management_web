import * as Types from '../actions/action-type';

export const profiles = (state = [], { type, profiles, profile }) => {
    switch (type) {
        case Types.SET_PROFILE_LIST:
            state = profiles;
            return state;
        case Types.SET_PROFILE:
            let index = state.findIndex(p => p.Id === profile.Id);
            if (index != -1) {
                state[index] = profile;
            }
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
