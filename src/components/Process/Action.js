import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/ProcessAction'
import { doWithFirstOne } from './../../utils/Utility'
import { ProcessActionTypes } from './../../reducers/ProcessReducer'

class Action extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameWarning: ''
        }
    }

    deleteAction = () => {
        this.props.deleteAction(this.props.stageId, this.props.actionId);
    }

    editType = (e) => {
        var actionName;
        if (e.target.value !== 4) {
            actionName = ProcessActionTypes[e.target.value].name;
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

    editMessageForm = (e) => {
        if (e.target.value === '-1') {
            this.action.messageFormId = null;
        } else {
            this.action.messageFormId = parseInt(e.target.value);
        }
        this.props.editAction(this.props.stageId, this.props.actionId, this.action);
        this.setState({
            messageFormId: e.target.value,
        })
    }

    editName = (e) => {
        if (e.target.value.trim() === '') {
            e.target.value = '';
        }
        this.action.name = e.target.value;
        this.props.editAction(this.props.stageId, this.props.actionId, this.action);
    }

    getExistedAction = () => {
        var existedAction = [false, false, false]
        this.stage.actions.map((act) => {
            if (act.type !== 3) {
                existedAction[act.type] = true;
            }
            return null;
        })
        return existedAction;
    }

    render() {
        var action = null;
        var stage = null;
        var messageForm = null;
        //get stage and action from store
        doWithFirstOne(this.props.process.stages, this.props.stageId, (sta) => {
            stage = sta;
            doWithFirstOne(sta.actions, this.props.actionId, (act) => {
                action = act;
            })
        })
        // get message form
        var mfList = this.props.messageForms;
        mfList.map((forms) => {
            if (forms.Id === action.messageFormId) {
                messageForm = forms;
            }
            return false;
        });
        var readOnly = this.props.processStatus.readOnly;
        this.action = action;
        this.stage = stage;
        this.state.actionType = action.type;
        this.state.messageFormId = action.messageFormId;
        this.state.existedAction = this.getExistedAction();
        this.state.nameWarning = action.name === '' ? 'Action name should not empty!' : '';
        return (<div className='panel panel-default'>
            <div className="panel-body action-body">
                <div className='row'>
                    {readOnly ?
                        // If read only
                        <div className='col-sm-10'>
                            <h5 className="panel-title">{action.name}</h5>
                        </div> :
                        //If not read only
                        <div className='col-sm-9 row'>
                            {/* Input name */}
                            <div className='col-sm-4'>
                                <div className='form-group'>
                                    <label>Name:</label>
                                    <input value={action.name} className='form-control'
                                        readOnly={action.type === 3 ? false : true}
                                        onChange={this.editName} ref='inputName' onBlur={() => {
                                            if (this.state.nameWarning.trim() !== '') {
                                                this.refs.inputName.focus();
                                            }
                                        }} />
                                    <span className='warning-text'>{readOnly ? null : this.state.nameWarning}</span>
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <div className='form-group'>
                                    {/* Select action type */}
                                    <label>Type:</label>
                                    <select className='form-control' ref='selectType' onChange={this.editType} value={this.state.actionType}>
                                        {ProcessActionTypes.map(({ type, name }) => {
                                            if (type === 3 || type === action.type
                                                || (type !== 3 && !this.state.existedAction[type])) {
                                                return <option value={type} selected={type === action.type}>{name}</option>
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <div className='form-group'>
                                    {/* Message form */}
                                    <label>Message form:</label>
                                    <select disabled={action.type !== 0 && action.type !== 1}
                                        className='form-control' onChange={this.editMessageForm} value={this.state.messageFormId}>
                                        <option value='-1' selected={action.messageFormId === null}>--</option>
                                        {mfList.map((mf) => {
                                            if ((action.type === 0 || action.type === 1) && action.type === mf.Type) {
                                                return <option value={mf.Id} selected={action.messageFormId === mf.Id}>{mf.Name}</option>
                                            } else {
                                                return null;
                                            }
                                        }
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    }
                    <div className='col-sm-2 panel-process-action'>
                        {/* Actions */}
                        {readOnly ? <h5>Message form: {messageForm !== null ? messageForm.Name : ''}</h5> :
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
        processStatus: state.processStatus,
        messageForms: state.messageForms
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