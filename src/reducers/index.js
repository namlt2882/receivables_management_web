import { combineReducers } from 'redux';
import users from './users';
import itemEditing from './itemEditing';
import filterTable from './filterTable';
import sortTable from './sortTable';

import { profiles, messageForms } from './ProfileReducer'
import { process, processStatus } from './ProcessReducer'
import { messages } from './MessageReducer';
import { receivable, receivableList, receivableStatus } from './ReceivableReducer';


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
    receivableStatus
});

export default appReducers;