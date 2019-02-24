import * as Types from '../actions/action-type';
import { IdGenerator, findAndEdit, findAndRemove, doWithFirstOne, findIndex } from '../utils/utility'


export const ProcessActionTypes = [
    {
        'type': 0,
        'name': 'SMS'
    },
    {
        'type': 1,
        'name': 'Phone call'
    },
    {
        'type': 2,
        'name': 'Visit'
    },
    {
        'type': 3,
        'name': 'Notification'
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
    frequency = 3;
    type = 3;
    startTime = 730;
    messageFormId = null;
    toProfile(action) {
        return {
            "Name": action.name,
            "Frequency": action.frequency,
            "StartTime": action.startTime,
            "Type": action.type,
            "ProfileMessageFormId": action.messageFormId
        }
    }
}

export class Stage {
    setData(processId, id, name, duration, order) {
        this.processId = processId;
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.order = order;
        return this;
    }
    id = IdGenerator.generateId();
    name = 'New Stage';
    order = 0;
    processId = null;
    duration = 30;
    actions = [];
    displayBody = true;

    toProfile(stage) {
        var tmp = new Action();
        return {
            "Name": stage.name,
            "Duration": stage.duration,
            "Sequence": stage.order,
            "Actions": stage.actions.map((action) => tmp.toProfile(action))
        }
    }

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
    stages = [new Stage()];
    toProfile(process) {
        var tmp = new Stage();
        var tmp2 = new Action();
        return {
            "Name": process.name,
            "DebtAmountFrom": 0,
            "DebtAmountTo": 0,
            "Stages": process.stages.map((stage) => {
                var model = tmp.toProfile(stage);
                return model;
            })
        }
    }
}

const resetStageIndex = (stages) => {
    let index = 1;
    stages.map((stage) => {
        stage.order = index;
        index++;
    })
}

export const process = (state = new Process(), { type, order, stageId, actionId, process, stage, action }) => {
    var index, up, down;
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
            newStage.order = state.stages.length;
            state.stages.push(newStage);
            return { ...state };
        case Types.EDIT_STAGE:
            findAndEdit(state.stages, stage);
            return { ...state };
        case Types.DELETE_STAGE:
            findAndRemove(state.stages, stageId);
            return { ...state };
        case Types.INCREMENT_STAGE_ORDER:
            index = findIndex(state.stages, stageId);
            up = state.stages[index];
            down = state.stages[index - 1];
            state.stages[index - 1] = up;
            state.stages[index] = down;
            resetStageIndex(state.stages);
            return { ...state };
        case Types.DECREMENT_STAGE_ORDER:
            index = findIndex(state.stages, stageId);
            up = state.stages[index + 1];
            down = state.stages[index];
            state.stages[index] = up;
            state.stages[index + 1] = down;
            resetStageIndex(state.stages);
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
