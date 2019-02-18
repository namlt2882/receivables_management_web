import * as Types from './../constants/ActionTypes';
import { IdGenerator, findAndEdit, findAndRemove, doWithFirstOne } from './../utils/Utility'

export const ProcessActionTypes = [
    {
        'type': 1,
        'name':'SMS'
    },
    {
        'type': 2,
        'name':'Phone call'
    },
    {
        'type': 3,
        'name':'Visit'
    },
    {
        'type': 4,
        'name':'Notification'
    }
]

export class Action {
    setData(stageId, id, name, frequency, type) {
        this.stageId = stageId;
        this.id = id;
        this.name = name;
        this.frequency = frequency;
        this.type = type;
        return this;
    }
    id = IdGenerator.generateId();
    name = 'New action';
    order = 1;
    stageId = null;
    frequency = null;
    type = 4
}

export class Stage {
    setData(processId, id, name, long) {
        this.processId = processId;
        this.id = id;
        this.name = name;
        this.long = long;
        return this;
    }
    id = IdGenerator.generateId();
    name = 'New Stage';
    order = 1;
    processId = null;
    long = 30;
    actions = [new Action()]
}

export class Process {
    setData(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
        return this;
    }
    id = IdGenerator.generateId();
    name = 'New Process';
    description = '';
    stages = [new Stage()]
}

export const process = (state = new Process(), { type, order, stageId, actionId, process, stage, action }) => {
    switch (type) {
        case Types.NEW_PROCESS:
            state = new Process();
            return { ...state };
        case Types.SET_PROCESS:
            state = process;
            return { ...state };
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
        case Types.SAVE_CACHE:
            localStorage.setItem('cache_process', JSON.stringify(state));
            return { ...state };
        case Types.LOAD_CACHE:
            let cacheProcess = JSON.parse(localStorage.getItem('cache_process'));
            localStorage.removeItem('cache_process');
            state = cacheProcess;
            return { ...state };
        default: return { ...state };
    }
}

export const processStatus = (state = {
    readOnly: true
}, { type }) => {
    switch (type) {
        case Types.SET_PROCESS_EDITABLE:
            state.readOnly = false;
            return { ...state };
        case Types.SET_PROCESS_UNEDITABLE:
            state.readOnly = true;
            return { ...state };
        default: return { ...state };
    }
}
