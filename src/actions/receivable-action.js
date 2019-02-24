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
    newReceivable: () => {
        return {
            type: Types.ADD_RECEIVABLE
        }
    },
    editReceivable: () => {
        return {
            type: Types.EDIT_RECEIVABLE
        }
    },
    getReceivable: () => {
        return {
            type: Types.GET_RECEIVABLE
        }
    },
    setReceivableList: (list) => {
        return {
            type: Types.SET_RECEIVABLE_LIST,
            list
        }
    },
    // receivable status
    setEditable: () => {
        return {
            type: Types.SET_RECEIVABLE_EDITABLE
        }
    },
    cancelEditable: () => {
        return {
            type: Types.SET_RECEIVABLE_UNEDITABLE
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
    getReceivable: (id) => {
        return async (dispatch) => {
            const res = await callApi(`receivable/${id}`, 'GET', null);
            dispatch(ReceivableAction.getReceivable(res.data));
        }
    },
    insertReceivables: (list) => {
        return async (dispatch) => {
            const res = await fetch('Receivable', 'POST', list);
            dispatch(ReceivableAction.setReceivableList(res.data));
        }
    }
}