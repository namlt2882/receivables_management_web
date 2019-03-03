import * as Types from './action-type';
import { callApi, fetch } from '../utils/api-caller';
import { receivable } from '../reducers/receivable-reducer';

export const ReceivableAction = {
    setReceivableList: (list) => {
        return {
            type: Types.SET_RECEIVABLE_LIST,
            list
        }
    }
}
