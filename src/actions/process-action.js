import * as Types from './action-type';
import { callApi } from '../utils/api-caller';
import { Process, Stage, Action } from '../reducers/process-reducer'
import { IdGenerator } from '../utils/utility'

export const ProcessAction = {
    //process
    newProcess: () => {
        return {
            type: Types.NEW_PROCESS
        }
    },
    setProcess: (process) => {
        return {
            type: Types.SET_PROCESS,
            process
        }
    },
    editProcess: (process) => {
        return {
            type: Types.EDIT_PROCESS,
            process
        }
    },
    loadCache: () => {
        return {
            type: Types.LOAD_CACHE
        }
    },
    saveCache: () => {
        return {
            type: Types.SAVE_CACHE
        }
    },
    //process status
    setEditable: () => {
        return {
            type: Types.SET_PROCESS_EDITABLE
        }
    },
    setUneditable: () => {
        return {
            type: Types.SET_PROCESS_UNEDITABLE
        }
    },

    //stage
    addStage: () => {
        return {
            type: Types.ADD_STAGE
        }
    },
    deleteStage: (stageId) => {
        return {
            type: Types.DELETE_STAGE,
            stageId
        }
    },
    editStage: (stage) => {
        return {
            type: Types.EDIT_STAGE,
            stage
        }
    },
    incrementStage: (stageId) => {
        return {
            type: Types.INCREMENT_STAGE_ORDER,
            stageId
        }
    },
    decrementStage: (stageId) => {
        return {
            type: Types.DECREMENT_STAGE_ORDER,
            stageId
        }
    },

    //action
    addAction: (stageId) => {
        return {
            type: Types.ADD_ACTION,
            stageId
        }
    },
    deleteAction: (stageId, actionId) => {
        return {
            type: Types.DELETE_ACTION,
            stageId, actionId
        }
    },
    editAction: (stageId, actionId, action) => {
        return {
            type: Types.EDIT_ACTION,
            stageId, actionId, action
        }
    }
}

const getMockProcess = () => {
    let process = new Process().setData(IdGenerator.generateId(), 'ACB Process', 'Customize process for ACB');
    let stage1 = new Stage().setData(process.id, IdGenerator.generateId(), 'Stage 1', 30, 1);
    let stage2 = new Stage().setData(process.id, IdGenerator.generateId(), 'Stage 2', 30, 2);
    let stage3 = new Stage().setData(process.id, IdGenerator.generateId(), 'Stage 3', 30, 3);
    process.stages = [stage1, stage2, stage3];
    let action1 = new Action().setData(null, null, 'SMS', null, 1);
    let action2 = new Action().setData(null, null, 'Phone call', null, 2);
    stage1.actions = [{ ...action1, id: IdGenerator.generateId() }, { ...action2, id: IdGenerator.generateId() }];
    stage2.actions = [{ ...action1, id: IdGenerator.generateId() }, { ...action2, id: IdGenerator.generateId() }]
    stage3.actions = [{ ...action1, id: IdGenerator.generateId() }, { ...action2, id: IdGenerator.generateId() }]
    return process;
}

export const enableEditable = () => {
    return (dispatch) => {
        dispatch(ProcessAction.setEditable());
        dispatch(ProcessAction.saveCache());
    }
}

export const cancelEditable = () => {
    return (dispatch) => {
        dispatch(ProcessAction.setUneditable());
        dispatch(ProcessAction.loadCache());
    }
}

export const ProfileProcessRequest = {
    getProcessDetailRequest: (id) => {
        return async (dispatch) => {
            // const res = await callApi(`process/{id}`, 'GET', null);
            dispatch(ProcessAction.setProcess(getMockProcess()));
        };
    }
}