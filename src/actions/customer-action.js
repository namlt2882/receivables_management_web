import * as Types from './action-type'
import { fetch } from '../utils/api-caller'

export const CustomerAction = {
    setCustomers: (customers) => {
        return {
            type: Types.SET_CUSTOMER_LIST,
            customers
        }
    }
}
