import * as Types from '../actions/action-type';

export const customers = (state = [], { type, customers, customer }) => {
    switch (type) {
        case Types.SET_CUSTOMER_LIST:
            state = customers;
            return state;
        default: return [...state];
    }
}

export const customer = (state = {}, { type, customer }) => {
    switch (type) {
        case Types.SET_CUSTOMER:
            state = customer;
            return state;
        case Types.ADD_CUSTOMER:
            state.push(customer);
            return state;
        default: return state;
    }
}