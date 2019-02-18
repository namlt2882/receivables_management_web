import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/ProcessAction'
import { doWithFirstOne } from './../../utils/Utility'
import { ProcessActionTypes } from './../../reducers/ProcessReducer'

class Action extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameWarning:''
        }
    }

    deleteAction = () => {
        this.props.deleteAction(this.props.stageId, this.props.actionId);
    }

    editType = (e) => {
        var actionName;
        if (e.target.value !== 4) {
            actionName = ProcessActionTypes[e.target.value - 1].name;
        } else {
            actionName = 'New action';
        }
        this.action.type = parseInt(e.target.value);
        this.action.name = actionName;
        this.props.editAction(this.props.stageId, this.props.actionId, this.action);
        var existedAction = this.getExistedAction();
        this.setState({
            actionType: e.target.value,
            existedAction: existedAction,
            nameWarning: ''
        })
    }

    editName = (e) => {
        var name = e.target.value;
        this.action.name = name;
        this.props.editAction(this.props.stageId, this.props.actionId, this.action);
        var warning = '';
        if (name.trim() === '') {
            warning = 'Action name should not empty!';
        }
        this.setState({ nameWarning: warning });
    }

    getExistedAction = () => {
        var existedAction = [false, false, false]
        this.stage.actions.map((act) => {
            if (act.type !== 4) {
                existedAction[act.type - 1] = true;
            }
            return null;
        })
        return existedAction;
    }

    render() {
        var action = null;
        var stage = null;
        doWithFirstOne(this.props.process.stages, this.props.stageId, (sta) => {
            stage = sta;
            doWithFirstOne(sta.actions, this.props.actionId, (act) => {
                action = act;
            })
        })
        var readOnly = this.props.processStatus.readOnly;

        this.action = action;
        this.stage = stage;
        this.state.actionType = action.type;
        this.state.existedAction = this.getExistedAction();
        return (<div className='panel panel-default'>
            <div className="panel-body action-body">
                <div className='row'>
                    {readOnly ? <h5 className="panel-title col-sm-9">{action.name}</h5> :
                        <div className='col-sm-9 row'>
                            <div className='col-sm-8'>
                                <input value={action.name} className='form-control'
                                    readOnly={action.type === 4 ? false : true}
                                    onChange={this.editName} ref='inputName' onBlur={() => {
                                        if (this.state.nameWarning.trim() !== '') {
                                            this.refs.inputName.focus();
                                        }
                                    }} />
                                <span className='warning-text'>{this.state.nameWarning}</span>
                            </div>
                            <div className='col-sm-4'>
                                <select className='form-control' ref='selectType' onChange={this.editType} value={this.state.actionType}>
                                    {ProcessActionTypes.map(({ type, name }) => {
                                        if (type === 4 || type === action.type
                                            || (type !== 4 && !this.state.existedAction[type - 1])) {
                                            return <option value={type} selected={type === action.type}>{name}</option>
                                        } else {
                                            return null;
                                        }
                                    })}
                                </select>
                            </div>
                        </div>
                    }
                    <div className='col-sm-3 panel-process-action'>
                        {readOnly ? null :
                            <div>
                                <span><i class="fa fa-trash fa-2" aria-hidden="true" onClick={this.deleteAction}></i></span>
                            </div>}
                    </div>
                </div>
            </div>
        </div>);
    }
}
const mapStateToProps = state => {
    return {
        process: state.process,
        processStatus: state.processStatus
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        deleteAction: (stageId, actionId) => {
            dispatch(ProcessAction.deleteAction(stageId, actionId));
        },
        editAction: (stageId, actionId, action) => {
            dispatch(ProcessAction.editAction(stageId, actionId, action));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Action);