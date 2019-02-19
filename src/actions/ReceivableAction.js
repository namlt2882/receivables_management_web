import * as Types from '../constants/ActionTypes';
import callApi from '../utils/APICaller';
import { receivable } from '../reducers/ReceivableReducer';

export const ReceivableAction = {
    fetchReceivableList: (list) => {
        return {
            type: Types.FETCH_RECEIVABLE_LIST,
            list
        };
    },
    newReceivable: () => {
        return {
            type: Types.ADD_RECEIVABLE
        }
    },
    editReceivable: () => {
        return {
            type: Types.EDIT_RECEIVABLE
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
    }
}