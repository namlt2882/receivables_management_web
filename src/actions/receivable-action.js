import * as Types from './action-type';

export const ReceivableAction = {
    setReceivableList: (list) => {
        return {
            type: Types.SET_RECEIVABLE_LIST,
            list
        }
    },
    setReceivableList2: (list) => {
        return {
            type: Types.SET_RECEIVABLE_LIST_2,
            list
        }
    },
    setNewReceivableIds: (list) => {
        return {
            type: Types.SET_NEW_RECEIVABLE_LIST,
            list
        }
    }
}
