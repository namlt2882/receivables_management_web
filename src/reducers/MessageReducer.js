import * as Types from './../constants/ActionTypes';

//var initialStateForSearch = '';
var initialState = [];

export const messages = (state = initialState, action) => { 
    switch (action.type) {
        case Types.FETCH_MESSAGES:
            state = action.messages;
            return [...state];
        default: return [...state];
    }
};



