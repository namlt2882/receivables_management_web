import * as Types from './action-type'

export const CustomerAction = {
    setCustomers: (customers) => {
        return {
            type: Types.SET_CUSTOMER_LIST,
            customers
        }
    },
    addCustomer: (customer) => {
        return {
            type: Types.ADD_CUSTOMER,
            customer
        }
    }
}
