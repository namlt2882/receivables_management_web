import * as Types from '../actions/action-type';

//var initialStateForSearch = '';
var initialState = [];

export const messages = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCH_MESSAGES:
            state = action.messages;
            return state;
        default: return [...state];
    }
};

export const message = (state = {}, action) => {
    switch (action.type) {
        case Types.SET_MESSAGE:
            state = action.message;
            return state;
        default: return state;
    }
};



