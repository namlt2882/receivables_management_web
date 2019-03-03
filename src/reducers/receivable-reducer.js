import * as Types from '../actions/action-type';

export const receivableList = (state = [], { type, list }) => {
    switch (type) {
        case Types.SET_RECEIVABLE_LIST:
            state = list;
            return state;
        default: return state;
    }
}
