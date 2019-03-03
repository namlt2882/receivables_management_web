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
}