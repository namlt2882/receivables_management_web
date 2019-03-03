import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProcessAction } from './../../actions/process-action'
import Stage from './stage'
import './process.scss'
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Container, Header, Form, Button } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen } from '@fortawesome/free-solid-svg-icons'
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
        if (process) {
            document.title = process.Name;
        }
        var stages = process.Stages;
        var readOnly = this.props.processStatus.readOnly;
        return (
            <Container>
                <Form loading={this.props.formLoading}>
                    {/* Heading */}
                    <Header className='text-center'>{process.Name}
                        {readOnly ? null : <FontAwesomeIcon icon='pen' size='md' color='black' className='icon-btn'
                            onClick={this.toggleUpdateForm} />}
                        <UpdateProcessForm process={process}
                            isOpen={this.state.openUpdateForm}
                            closeForm={this.toggleUpdateForm}
                            updateProcess={this.props.editProcess} />
                    </Header>
                    <Form.Field>
                        <label>Stages:</label>
                        <div className="stage-list">
                            {
                                stages.map((stage, i) => <Stage stageId={stage.Id} key={i} />)
                            }
                            {readOnly ? null :
                                (<Button onClick={this.props.addStage}>Add stage</Button>)
                            }
                        </div>
                    </Form.Field>
                </Form>
            </Container>
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