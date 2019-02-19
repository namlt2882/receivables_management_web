import * as Types from './../constants/ActionTypes';

export class Receivable {
    id = 1;
    name = "New Receivable";
    profile = null;
    closedDay = null;
    isDeleted = null;
    collectors = null;
}

export const receivableList = (state = [], { type, list }) => {
    switch (type) {
        case Types.FETCH_RECEIVABLE_LIST:
            state = list;
            return state;
        default: return state;
    }
}

export const receivable = (state = new Receivable(), { type, receivable }) => {
    switch (type) {
        case Types.ADD_RECEIVABLE:
            state = new Receivable();
            return { ...state };
        case Types.EDIT_RECEIVABLE:
            state = { ...receivable };
            return { ...state };
        default: return { ...state };
    }
}