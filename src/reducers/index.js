import { combineReducers } from 'redux';
import users from './users';
import itemEditing from './itemEditing';
import filterTable from './filterTable';
import sortTable from './sortTable';
import { customers } from './CustomerReducer'
import { profiles, messageForms } from './ProfileReducer'
import { process, processStatus } from './ProcessReducer'
import { messages } from './MessageReducer';
import { receivable, receivableList, receivableStatus } from './ReceivableReducer';
import { contacts } from './ContactReducer'


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
    contacts
});

export default appReducers;