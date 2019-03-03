import React, { Component } from 'react';
import Action from './action'
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/process-action'
import { Container, Header, Form, Button, Table } from 'semantic-ui-react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { numAsTime } from '../../utils/time-converter'
import * as ProcessReducer from '../../reducers/process-reducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faPen } from '@fortawesome/free-solid-svg-icons'
import { describeActionType } from '../receivable-pages/receivable-detail/receivable-detail';
library.add(faTrashAlt, faPen);

class Stage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayBody: true,
            openUpdateForm: false
        }
        this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
    }

    toggleUpdateForm() {
        this.setState(pre => ({ openUpdateForm: !pre.openUpdateForm }))
    }

    addAction = () => {
        this.props.addAction(this.props.stageId);
    }

    deleteStage = () => {
        if (window.confirm('Are you sure to delete this stage?')) {
            this.props.deleteStage(this.props.stageId);
        }
    }

    displayOrCollapse = (e) => {
        e.preventDefault();
        var displayBody = !this.state.displayBody;
        this.setState({ displayBody: displayBody })
    }

    render() {
        let stage = this.props.process.Stages.find((s) => s.Id == this.props.stageId);
        let durationWarning = stage.Duration <= 0 ? 'Duration must longer than 0 day!' : '';
        var readOnly = this.props.processStatus.readOnly;
        return (<Container className='process-stage'>
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
                                        onClick={this.deleteStage} />
                                </div>
                            }
                            {this.state.displayBody ?
                                <a href='' onClick={this.displayOrCollapse}>Collapse</a> :
                                <a href='' onClick={this.displayOrCollapse}>Expanse</a>}
                        </div>
                    </div>
                    <UpdateStageForm isOpen={this.state.openUpdateForm} stage={stage} toggle={this.toggleUpdateForm} updateStage={this.props.editStage} />
                </div>
            </Header>
            <div className='panel-body' ref='body' style={{ display: this.state.displayBody ? 'block' : 'none' }}>
                <div className='row'>
                    <div className='stage-info col-sm-3'>
                        <div>
                            <div>
                                <span className='bold-text'>Duration:</span><span>{` ${stage.Duration} day(s)`}</span>
                            </div>
                            <div className='note'>
                                Notes:<br />
                                2 SMS will be sent<br />
                                2 auto call will be sent<br />
                                10 visit will be done<br />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-9'>
                        <div class="form-group">
                            <label className='bold-text'>Action:</label>
                            {stage.Actions.length > 0 ? <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>No.</Table.HeaderCell>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>Type</Table.HeaderCell>
                                        <Table.HeaderCell>Start time</Table.HeaderCell>
                                        <Table.HeaderCell>Frequency</Table.HeaderCell>
                                        <Table.HeaderCell>Message</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {stage.Actions.map((a, i) => {
                                        let messageForm = this.props.messageForms.find(mf => mf.Id === a.ProfileMessageFormId);
                                        return <Table.Row>
                                            <Table.Cell>{i + 1}</Table.Cell>
                                            <Table.Cell>{a.Name}</Table.Cell>
                                            <Table.Cell>{describeActionType(a.Name, a.Type)}</Table.Cell>
                                            <Table.Cell>{numAsTime(a.StartTime)}</Table.Cell>
                                            <Table.Cell>{`${a.Frequency} days/time`}</Table.Cell>
                                            <Table.Cell>
                                                {messageForm ? messageForm.Name : ''}
                                            </Table.Cell>
                                        </Table.Row>
                                    })}
                                </Table.Body>
                            </Table> : null}
                        </div>
                    </div>
                </div>
            </div>
        </Container>);
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
        this.props.toggle();
        let stage = this.props.stage;
        this.setState({
            name: stage.Name,
            duration: stage.Duration,
            actions: stage.Actions.map(a => ({ ...a }))
        })
    }
    updateStage() {
        let stage = this.props.stage;
        stage.Duration = this.state.duration;
        stage.Actions = this.state.actions;
        this.props.updateStage(stage);
        this.props.toggle();
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
        return (<Modal isOpen={this.props.isOpen} className='big-modal'>
            <ModalHeader>{this.state.name}</ModalHeader>
            <ModalBody>
                <Form onSubmit={this.updateStage} ref='form'>
                    <Form.Field>
                        <Form.Input label='Stage Duration:' type='number' min='1' name='duration' required={true}
                            ref='inputDuration' value={this.state.duration}
                            onChange={(e) => { this.setState({ duration: e.target.value }) }} />
                    </Form.Field>
                    <Form.Field>
                        <label>Actions:</label>
                        <Table fixed>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No.</Table.HeaderCell>
                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                    <Table.HeaderCell>Type</Table.HeaderCell>
                                    <Table.HeaderCell>Start time</Table.HeaderCell>
                                    <Table.HeaderCell>Frequency</Table.HeaderCell>
                                    <Table.HeaderCell>Message</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.actions.map((action, i) =>
                                    <Action action={action} key={i} no={i + 1}
                                        updateAction={this.updateAction}
                                        deleteAction={this.deleteAction}
                                        duration={this.state.duration} />)}
                                <Table.Row>
                                    <Table.Cell colspan='7'>
                                        <Button onClick={this.addAction}>Add Action</Button>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Form.Field>
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