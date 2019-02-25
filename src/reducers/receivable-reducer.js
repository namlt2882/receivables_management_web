import * as Types from '../actions/action-type';

export class Receivable {
    Id = null;
    Name = "New Receivable";
    ClosedDay = null;
    PayableDay = null;
    PrepaidAmount = 0;
    DebAmount = 0;
    CustomerId = null;
    LocationId = null;
}

export const receivableList = (state = [], { type, list }) => {
    switch (type) {
        case Types.FETCH_RECEIVABLE_LIST:
            state = list;
            return state;
        case Types.SET_RECEIVABLE_LIST:
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
        case Types.SET_PROCESS_EDITABLE:
            localStorage.setItem('cache_receivable', JSON.stringify(state));
            return { ...state }
        case Types.SET_PROCESS_UNEDITABLE:
            let cache = JSON.parse(localStorage.getItem('cache_receivable'));
            state = cache;
            return { ...state }
        default: return { ...state };
    }
}
class ReceivableStatus {
    readOnly = true;
}
export const receivableStatus = (state = new ReceivableStatus(), { type, readOnly }) => {
    switch (type) {
        case Types.SET_PROCESS_EDITABLE:
            state.readOnly = false;
            return state
        case Types.SET_PROCESS_UNEDITABLE:
            state.readOnly = true;
            return state
        default: return state
    }
}