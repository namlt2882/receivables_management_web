import * as Types from './../constants/ActionTypes';

export const contacts = (state = [], { type, contacts }) => {
    switch (type) {
        case Types.SET_CONTACTS:
            state = contacts;
            return state;
        default: return state;
    }
}