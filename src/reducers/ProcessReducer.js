import * as Types from './../constants/ActionTypes';
import { IdGenerator, findAndEdit, findAndRemove, doWithFirstOne } from './../utils/Utility'
import jQuery from 'jquery'

export class Action {
    id = IdGenerator.generateId();
    name = 'New Action';
    order = 1;
    stageId = null;
    frequency = null
}

export class Stage {
    id = IdGenerator.generateId();
    name = 'New Stage';
    order = 1;
    processId = null;
    long = 30;
    actions = [new Action()]
}

export class Process {
    id = IdGenerator.generateId();
    name = 'New Process';
    description = '';
    stages = [new Stage()]
}

export const process = (state = new Process(), { type, order, stageId, actionId, process, stage, action }) => {
    switch (type) {
        case Types.EDIT_PROCESS:
            state = { ...process };
            return { ...state };
        //STAGE
        case Types.ADD_STAGE:
            //deep copy by jquery
            let newStage = new Stage();
            newStage.processId = state.id;
            if (order) {
                newStage.order = order;
            }
            state.stages.push(newStage);
            return { ...state };
        case Types.EDIT_STAGE:
            findAndEdit(state.stages, stage);
            return { ...state };
        case Types.DELETE_STAGE:
            findAndRemove(state.stages, stageId);
            return { ...state };
        //ACTION
        case Types.ADD_ACTION:
            let newAction = new Action();
            newAction.stageId = stageId;
            if (order) {
                newAction.order = order;
            }
            doWithFirstOne(state.stages, stageId, (sta) => {
                sta.actions.push(newAction);
                console.log(sta.actions);
            });
            return { ...state };
        case Types.EDIT_ACTION:
            doWithFirstOne(state.stages, stageId, (sta) => {
                findAndEdit(sta.actions, action);
            });
            return { ...state };
        case Types.DELETE_ACTION:
            doWithFirstOne(state.stages, stageId, (sta) => {
                findAndRemove(sta.actions, actionId);
            });
            return { ...state };
        default: return { ...state };
    }
}
