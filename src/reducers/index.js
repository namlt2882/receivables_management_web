import { combineReducers } from 'redux';
import { users, user } from './user-reducer';
import itemEditing from './item-editing';
import filterTable from './filter-table';
import sortTable from './sort-table';
import { customers, customer } from './customer-reducer'
import { profiles, messageForms } from './profile-reducer'
import { process, processStatus } from './process-reducer'
import { messages, message } from './message-reducer';
import { receivableList, newReceiavbleIds, receivableList2, smsAndPhonecall } from './receivable-reducer';
import { contacts } from './contact-reducer';
import { collectors } from './collector-reducer';
import { matchData } from './match-point-reducer'

const appReducers = combineReducers({
    users, user,
    itemEditing,
    filterTable,
    sortTable,
    profiles,
    messageForms,
    process,
    processStatus,
    messages,
    message,
    receivableList, receivableList2, smsAndPhonecall,
    newReceiavbleIds,
    customers,
    customer,
    contacts,
    collectors,
    matchData
});

export default appReducers;