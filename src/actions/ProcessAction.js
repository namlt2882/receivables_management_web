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

    //action
    addAction: (stageId) => {
        return {
            type: Types.ADD_ACTION,
            stageId
        }
    }
}