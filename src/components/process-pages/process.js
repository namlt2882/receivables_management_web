import { library } from '@fortawesome/fontawesome-svg-core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Form, Header } from 'semantic-ui-react';
import { ProcessAction } from './../../actions/process-action';
import './process.scss';
import Stage from './stage';
library.add(faPen);

class Process extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openUpdateForm: false
        }
        this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
    }

    toggleUpdateForm() {
        this.setState(pre => ({
            openUpdateForm: !pre.openUpdateForm
        }))
    }

    render() {
        var process = this.props.process;
        if (process && !this.props.isPopup) {
            document.title = process.Name;
        }
        var stages = process.Stages;
        var readOnly = this.props.processStatus.readOnly;
        let showProcessName = false;
        if (this.props.isPopup) {
            showProcessName = false;
        } else if (!readOnly) {
            showProcessName = true;
        }
        return (
            <div className='col-sm-12'>
                <Form loading={this.props.formLoading}>
                    {/* Heading */}
                    <Header className='text-center'
                        style={{
                            display: showProcessName ? 'block' : 'none'
                        }}>{process.Name}
                        {readOnly ? null : <FontAwesomeIcon icon='pen' size='md' color='black' className='icon-btn'
                            onClick={this.toggleUpdateForm} />}
                        <UpdateProcessForm process={process}
                            isOpen={this.state.openUpdateForm}
                            closeForm={this.toggleUpdateForm}
                            updateProcess={this.props.editProcess} />
                    </Header>
                    <Form.Field>
                        <div className="stage-list row justify-content-center">
                            {
                                stages.map((stage) => <Stage stageId={stage.Id} key={stage.Id} />)
                            }
                            {readOnly ? null :
                                [<div className='col-sm-10'>
                                    <Button color='primary' onClick={this.props.addStage}>Add stage</Button>
                                </div>]
                            }
                        </div>
                    </Form.Field>
                </Form>
            </div>
        );
    }
}

export class UpdateProcessForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.process.Name
        }
        this.updateProcess = this.updateProcess.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }
    updateProcess(e) {
        e.preventDefault();
        let process = this.props.process;
        process.Name = this.state.name;
        this.props.updateProcess(process);
        this.props.closeForm();
    }
    closeForm() {
        this.props.closeForm();
        let process = this.props.process;
        this.setState({ name: process.Name })
    }
    render() {
        return (<Modal isOpen={this.props.isOpen}>
            <ModalBody>
                {/* Input name */}
                <Form action='/' onSubmit={this.updateProcess} ref='form'>
                    <Form.Field>
                        <Form.Input label='Profile Name:' value={this.state.name} required={true}
                            onChange={(e) => { this.setState({ name: e.target.value }) }}
                            placeholder='name of profile' />
                    </Form.Field>
                    <button type='submit' ref='btnSubmit' style={{ display: 'none' }}></button>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button type='submit' color='primary' onClick={() => { this.refs.btnSubmit.click() }}>OK</Button>
                <Button color='secondary' onClick={this.closeForm}>Cancel</Button>
            </ModalFooter>
        </Modal>);
    }
}

export const validateProcess = (process) => {
    if (process.Stages.length === 0) {
        return 'A Profile must has at least 1 stage!'
    }
    return null;
}
export const validateStage = (stage) => {
    if (stage.Actions.length === 0) {
        return 'A Stage must has at least 1 action!'
    }
    return null;
}

export const validateAction = (action, actions) => {
    let type = action.Type;
    if (type == 0 || type == 1) {
        let actionType = type == 0 ? 'SMS' : 'Phone call';
        if (!action.ProfileMessageFormId) {
            return `[${actionType}] action need an attached Message form.`
        }
    } else if (type == 3) {
        let curIndex = actions.findIndex(a => a.Id === action.Id);
        let nextIndex = actions.findIndex(a => a.Name == action.Name && a.Id !== action.Id);
        if (curIndex != -1 && nextIndex != -1) {
            if (curIndex > nextIndex) {
                return `[${action.Name}] is already existed.`
            }
        }
    }
    return null;
}

const mapStateToProps = state => {
    return {
        process: state.process,
        processStatus: state.processStatus
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        addStage: () => {
            dispatch(ProcessAction.addStage());
        },
        editProcess: (process) => {
            dispatch(ProcessAction.editProcess(process));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Process);