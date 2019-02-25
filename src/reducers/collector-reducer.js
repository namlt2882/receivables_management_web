import * as Types from '../actions/action-type';

export const collectors = (state = [], { type, collectors }) => {
    switch (type) {
        case Types.FETCH_COLLECTORS:
            state = collectors;
            return state;
        default: return state;
    }
}