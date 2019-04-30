import * as Types from '../actions/action-type';

export const receivableList = (state = [], { type, list }) => {
    switch (type) {
        case Types.SET_RECEIVABLE_LIST:
            state = list;
            return state;
        default: return state;
    }
}

export const receivableList2 = (state = [], { type, list }) => {
    switch (type) {
        case Types.SET_RECEIVABLE_LIST_2:
            state = list;
            return state;
        default: return state;
    }
}

export const newReceiavbleIds = (state = [], { type, list }) => {
    switch (type) {
        case Types.SET_NEW_RECEIVABLE_LIST:
            state = list;
            return state;
        default: return state;
    }
}

export const smsAndPhonecall = (state = {
    open: false
}, { type, open }) => {
    switch (type) {
        case Types.SET_SMS_AND_PHONECALL_OPEN:
            state.open = open
            return state;
        default: return state;
    }
}
