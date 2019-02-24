import { combineReducers } from 'redux';
import users from './user-reducer';
import itemEditing from './item-editing';
import filterTable from './filter-table';
import sortTable from './sort-table';
import { customers } from './customer-reducer'
import { profiles, messageForms } from './profile-reducer'
import { process, processStatus } from './process-reducer'
import { messages } from './message-reducer';
import { receivable, receivableList, receivableStatus } from './receivable-reducer';
import { contacts } from './contact-reducer'
import { collectors } from './collector-reducer'

const appReducers = combineReducers({
    users,
    itemEditing,
    filterTable,
    sortTable,
    profiles,
    messageForms,
    process,
    processStatus,
    messages,
    receivable,
    receivableList,
    receivableStatus,
    customers,
    contacts,
    collectors
});

export default appReducers;