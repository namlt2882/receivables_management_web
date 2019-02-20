import * as Types from './../constants/ActionTypes'

export const collectors = (state = [], { type, collectors }) => {
    switch (type) {
        case Types.FETCH_COLLECTORS:
            state = collectors;
            return state;
        default: return state;
    }
}