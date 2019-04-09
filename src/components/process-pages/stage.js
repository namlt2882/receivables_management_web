import { library } from '@fortawesome/fontawesome-svg-core';
import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button, Form, Header } from 'semantic-ui-react';
import * as ProcessReducer from '../../reducers/process-reducer';
import ConfirmModal from '../modal/ConfirmModal';
import { ProcessAction } from './../../actions/process-action';
import Action from './action';
library.add(faTrashAlt, faPen);

class Stage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openUpdateForm: false,
            openConfirm: false
        }
        this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
        this.groupStageAction = this.groupStageAction.bind(this);
        this.buildStageDescription = this.buildStageDescription.bind(this);
    }

    toggleUpdateForm() {
        this.setState(pre => ({ openUpdateForm: !pre.openUpdateForm }))
    }

    addAction = () => {
        this.props.addAction(this.props.stageId);
    }

    deleteStage = () => {
        this.setState({ openConfirm: false });
        this.props.deleteStage(this.props.stageId);
    }

    groupStageAction(stage) {
        let actions = [];
        stage.Actions.reduce((acc, action) => {
            let actionType = action.Type;
            let actionName = action.Name;
            let groupAction;
            if (actionType === 3) {
                groupAction = acc.find(act => act.type === actionType && act.name === actionName);
            } else {
                groupAction = acc.find(act => act.type === actionType);
            }
            if (!groupAction) {
                groupAction = {
                    type: actionType,
                    name: actionName,
                    quantity: Math.floor(stage.Duration / action.Frequency)
                }
                acc.push(groupAction);
            } else {
                groupAction.quantity = groupAction.quantity + Math.floor(stage.Duration / action.Frequency);
            }
            return acc;
        }, actions);
        actions.sort((a1, a2) => a1.type - a2.type);
        return actions;
    }

    buildStageDescription(groupActions) {
        let result = '';
        result = groupActions.flatMap((a, i) => {
            let description;
            if (a.type !== 3) {
                let isAuto = a.type === 0 || a.type === 1;
                let actionType = ProcessReducer.ProcessActionTypes.find(aOrigin => aOrigin.type === a.type);
                if (actionType) {
                    description = `${actionType.name}${isAuto ? ' (auto)' : ''}: ${a.quantity} time(s)`;
                }
            } else {
                description = `${a.name}: ${a.quantity} time(s)`;
            }
            return [description, ((i + 1) === groupActions.length ? null : <br />)]
        });
        if (result.length == 0) {
            result = 'No action'
        }
        return result;
    }

    render() {
        let stage = this.props.process.Stages.find((s) => s.Id == this.props.stageId);
        let durationWarning = stage.Duration <= 0 ? 'Duration must longer than 0 day!' : '';
        var readOnly = this.props.processStatus.readOnly;
        let stageActions = this.groupStageAction(stage);
        let description = this.buildStageDescription(stageActions);
        return (<div className='process-stage col-sm-3'>
            <Header>
                <div className='row'>
                    <span className="col-sm-6">{stage.Name}</span>
                    <div className='col-sm-6 panel-process-action'>
                        <div>
                            {readOnly ? null :
                                <div>
                                    {/* Edit button */}
                                    <FontAwesomeIcon icon='pen' size='md' color='black' className='icon-btn'
                                        onClick={this.toggleUpdateForm} />
                                    {/* Delete button */}
                                    <FontAwesomeIcon icon='trash-alt' size='md' color='black' className='icon-btn'
                                        onClick={() => {
                                            this.setState({ openConfirm: true });
                                        }} />
                                </div>
                            }
                        </div>
                    </div>
                    <UpdateStageForm isOpen={this.state.openUpdateForm} stage={stage}
                        toggle={this.toggleUpdateForm} updateStage={this.props.editStage}
                        deleteStage={this.deleteStage} />
                </div>
            </Header>
            <div className='panel-body' ref='body'>
                <div className='row'>
                    <div className='stage-info col-sm-12'>
                        <div>
                            <div>
                                <span className='bold-text'>Duration:</span><span>{` ${stage.Duration} day(s)`}</span>
                            </div>
                            <div className='note'>{description}</div>
                        </div>
                    </div>
                </div>
                <ConfirmModal
                    show={this.state.openConfirm}
                    onHide={() => { this.setState({ openConfirm: false }) }}
                    header="Confirm to delete stage"
                    body="Are you sure to delete this stage?"
                    callback={this.deleteStage} />
            </div>
        </div>);
    }
}

export class UpdateStageForm extends Component {
    constructor(props) {
        super(props);
        let stage = this.props.stage;
        this.state = {
            name: stage.Name,
            duration: stage.Duration,
            actions: stage.Actions.map(a => ({ ...a }))
        }
        this.updateStage = this.updateStage.bind(this);
        this.updateAction = this.updateAction.bind(this);
        this.deleteAction = this.deleteAction.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.addAction = this.addAction.bind(this);
    }
    closeForm() {
        let stage = this.props.stage;
        if (stage._isNew) {
            this.props.deleteStage();
        } else {
            this.props.toggle();
            this.setState({
                name: stage.Name,
                duration: stage.Duration,
                actions: stage.Actions.map(a => ({ ...a }))
            })
        }
    }
    updateStage() {
        let stage = this.props.stage;
        if (stage._isNew) {
            stage._isNew = false;
        } else {
            this.props.toggle();
        }
        stage.Duration = this.state.duration;
        stage.Actions = this.state.actions;
        this.props.updateStage(stage);
    }
    addAction(e) {
        e.preventDefault();
        let newAction = new ProcessReducer.Action();
        this.state.actions.push(newAction);
        this.setState(pre => ({ actions: pre.actions }));
    }
    updateAction(action) {
        let origin = this.state.actions.find(a => a.Id === action.Id);
        if (origin) {
            origin = { ...action };
        }
        this.setState({ actions: this.state.actions })
    }
    deleteAction(id) {
        let newActions = this.state.actions.filter(a => a.Id !== id);
        this.setState({ actions: newActions });
    }
    render() {
        let stage = this.props.stage;
        return (<Modal isOpen={this.props.isOpen || stage._isNew} className='big-modal'>
            <ModalHeader>{stage._isNew ? `Add new stage: ${this.state.name}` : this.state.name}</ModalHeader>
            <ModalBody>
                <Form onSubmit={this.updateStage} ref='form'>
                    <Form.Field>
                        <Form.Input label='Stage Duration:' type='number' min='1' name='duration' required={true}
                            ref='inputDuration' value={this.state.duration}
                            onChange={(e) => { this.setState({ duration: parseInt(e.target.value) }) }} />
                    </Form.Field>
                    <Form.Field>
                        <label>Actions:</label>
                        {this.state.actions.length > 0 ? <table className='table thin'>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Start time</th>
                                    <th>Frequency</th>
                                    <th>Message</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.actions.map((action, i) =>
                                    <Action action={action} key={i} no={i + 1}
                                        updateAction={this.updateAction}
                                        deleteAction={this.deleteAction}
                                        duration={this.state.duration} />)}
                            </tbody>
                        </table> : <div className='text-center bold-text' style={{ fontSize: '2rem' }}>
                                <i>No action!</i>
                            </div>}
                    </Form.Field>
                    <Button color='primary' style={{ width: '10rem' }} onClick={this.addAction}>Add Action</Button>
                    <button type='submit' ref='btnSubmit' style={{ display: 'none' }}></button>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button type='submit' color='primary' onClick={() => { this.refs.btnSubmit.click() }}>OK</Button>
                <Button onClick={this.closeForm} color='secondary'>Cancel</Button>
            </ModalFooter>
        </Modal>);
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
        addAction: (stageId) => {
            dispatch(ProcessAction.addAction(stageId));
        },
        deleteStage: (stageId) => {
            dispatch(ProcessAction.deleteStage(stageId));
        },
        editStage: (stage) => {
            dispatch(ProcessAction.editStage(stage));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Stage);