import * as Types from '../actions/action-type';
import { IdGenerator } from '../utils/utility';


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
    Id = IdGenerator.generateId();
    Name = 'New action';
    StageId = null;
    Frequency = 1;
    Type = 3;
    StartTime = 730;
    ProfileMessageFormId = null;
    toProfile(action) {
        let rs = {
            "Name": action.Name,
            "Frequency": action.Frequency,
            "StartTime": action.StartTime,
            "Type": action.Type,
            "ProfileMessageFormId": action.ProfileMessageFormId
        }
        if (action.Id && action.Id > 0) {
            rs.Id = action.Id;
        }
        return rs;
    }
}

export class Stage {
    Id = IdGenerator.generateId();
    Name = 'Stage 1';
    Sequence = 0;
    ProcessId = null;
    Duration = 30;
    Actions = [];

    toProfile(stage, sequence) {
        let tmp = new Action();
        let rs = {
            "Name": stage.Name,
            "Duration": stage.Duration,
            "Sequence": sequence,
            "Actions": stage.Actions.map((action) => tmp.toProfile(action))
        }
        if (stage.Id && stage.Id > 0) {
            rs.Id = stage.Id;
        }
        return rs;
    }

}

export class Process {
    Id = IdGenerator.generateId();
    Name = 'New Process';
    Stages = [];
    toProfile(process) {
        let tmp = new Stage();
        let rs = {
            "Name": process.Name,
            "DebtAmountFrom": 0,
            "DebtAmountTo": 0,
            "Stages": process.Stages.map((stage, i) => {
                var model = tmp.toProfile(stage, i + 1);
                return model;
            })
        }
        if (process.Id && process.Id > 0) {
            rs.Id = process.Id;
        }
        return rs;
    }
}

const resetStageIndex = (stages) => {
    stages.map((stage, i) => {
        stage.Sequence = (i + 1);
    })
}

export const process = (state = new Process(), { type, order, stageId, actionId, process, stage, action,
    processName }) => {
    let stage1;
    let action1;
    if (stageId) {
        stage1 = state.Stages.find(s => s.Id === stageId);
        if (actionId && stage1) {
            action1 = stage1.Actions.find(a => a.Id === actionId);
        }
    }
    switch (type) {
        case Types.NEW_PROCESS:
            state = new Process();
            return { ...state };
        case Types.SET_PROCESS:
            state = process;
            localStorage.removeItem('cache_process');
            return { ...state };
        case Types.EDIT_PROCESS:
            state = { ...process };
            return { ...state };
        case Types.CLONE_PROCESS:
            state.Id = IdGenerator.generateId();
            state.Name = processName;
            state.Stages.forEach(s => {
                s.Id = IdGenerator.generateId();
                s.Actions.forEach(a => {
                    a.Id = IdGenerator.generateId();
                })
            })
            return { ...state };
        //STAGE
        case Types.ADD_STAGE:
            //deep copy by jquery
            let newStage = new Stage();
            newStage.ProcessId = state.Id;
            if (order) {
                newStage.Sequence = order;
            }
            newStage.Sequence = state.Stages.length;
            newStage._isNew = true;
            state.Stages.push(newStage);
            state.Stages.forEach((s, i) => {
                s.Name = 'Stage ' + (i + 1);
                s.Sequence = (i + 1);
            })
            return { ...state };
        case Types.EDIT_STAGE:
            if (stage1) {
                stage1 = { ...stage };
                stage1.Actions = stage.Actions;
            }
            return { ...state };
        case Types.DELETE_STAGE:
            state.Stages = state.Stages.filter((s) => s.Id !== stageId);
            state.Stages.forEach((s, i) => {
                s.Name = 'Stage ' + (i + 1);
                s.Sequence = (i + 1);
            })
            return state;
        //ACTION
        case Types.ADD_ACTION:
            let newAction = new Action();
            newAction.StageId = stageId;
            stage1.Actions.push(newAction);
            return { ...state };
        case Types.EDIT_ACTION:
            action1 = { ...action };
            return { ...state };
        case Types.DELETE_ACTION:
            stage1.Actions = stage1.Actions.filter(a => a.Id === actionId);
            return { ...state };
        case Types.SAVE_CACHE:
            localStorage.setItem('cache_process', JSON.stringify(state));
            return { ...state };
        case Types.LOAD_CACHE:
            let cacheProcess = JSON.parse(localStorage.getItem('cache_process'));
            localStorage.removeItem('cache_process');
            if (cacheProcess) {
                state = cacheProcess;
            }
            return { ...state };
        default: return { ...state };
    }
}

export const processStatus = (state = {
    readOnly: true,
    isSubmitForm: false
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
