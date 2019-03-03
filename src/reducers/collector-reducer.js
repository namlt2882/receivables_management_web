import * as Types from '../actions/action-type';

export const collectors = (state = [], { type, collectors }) => {
    switch (type) {
        case Types.SET_COLLECTOR_LIST:
            state = collectors;
            return state;
        default: return state;
    }
}