import * as Types from '../actions/action-type';


export const customers = (state = [], action) => {
    switch (action.type) {
        case Types.SET_CUSTOMER_LIST:
            state = action.customers;
            return state;
        default: return [...state];
    }
}

export const customer = (state = {}, action) => {
    switch (action.type) {
        case Types.SET_CUSTOMER:
            state = action.customer;
            return state;
        default: return state;
    }
}