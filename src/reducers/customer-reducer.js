import * as Types from '../actions/action-type';

export const customers = (state = [], { type, customers }) => {
    switch (type) {
        case Types.SET_CUSTOMER_LIST:
            state = customers;
            return state;
        default: return state;
    }
}