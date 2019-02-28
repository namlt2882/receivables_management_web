import * as Types from './action-type';
import { callApi, fetch } from '../utils/api-caller';
import { receivable } from '../reducers/receivable-reducer';

export const ReceivableAction = {
    fetchReceivableList: (list) => {
        return {
            type: Types.FETCH_RECEIVABLE_LIST,
            list
        };
    },
    setReceivableList: (list) => {
        return {
            type: Types.SET_RECEIVABLE_LIST,
            list
        }
    }
}

export const ReceivableRequest = {
    createReceivable: (receivable) => {
        return async (dispatch) => {
            const res = await callApi('receivable', 'POST', null);
        }
    },
    fetchReceivableList: () => {
        return async (dispatch) => {
            const res = await callApi('receivable', 'GET', null);
            dispatch(ReceivableAction.fetchReceivableList(res.data));
        }
    },
    insertReceivables: (list) => {
        return async (dispatch) => {
            const res = await fetch('Receivable', 'POST', list);
        }
    }
}