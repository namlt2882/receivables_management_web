import * as Types from './action-type'
import { fetch } from '../utils/api-caller'

export const CustomerAction = {
    fetchCustomers: (customers) => {
        return {
            type: Types.FETCH_CUSTOMERS,
            customers
        }
    }
}

export const CustomerRequest = {
    fetchCustomers: () => {
        return async (dispatch) => {
            var res = await fetch('customer', 'GET', null);
            dispatch(CustomerAction.fetchCustomers(res.data));
        }
    }
}