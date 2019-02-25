import * as Types from '../actions/action-type';

export const customers = (state = [], { type, customers }) => {
    switch (type) {
        case Types.FETCH_CUSTOMERS:
            state = customers;
            return state;
        default: return state;
    }
}