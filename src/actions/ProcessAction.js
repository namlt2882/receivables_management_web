import * as Types from '../constants/ActionTypes';

export const ProcessAction = {
    //process
    editProcess: (process) => {
        return {
            type: Types.EDIT_PROCESS,
            process
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
    }
}