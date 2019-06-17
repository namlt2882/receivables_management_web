import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button, Container, Divider, Form, Message } from 'semantic-ui-react';
import Process, { validateProcess } from '../../components/process-pages/process';
import * as ProcessReducer from '../../reducers/process-reducer';
import { ProfileService } from '../../services/profile-service';
import Component from '../common/component';
import { available, available1, PrimaryLoadingPage } from '../common/loading-page';
import { errorAlert, successAlert } from '../common/my-menu';
import ConfirmModal from '../modal/ConfirmModal';
import { cancelEditable, enableEditable, ProcessAction } from './../../actions/process-action';
import { ProfileAction } from './../../actions/profile-action';
import './profile.scss';

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 2,
            formLoading: false,
            isProcessing: false,
            openConfirm: false,
            isOpenCloneForm: false
        }
        this.setEditable = this.setEditable.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.saveProfile = this.saveProfile.bind(this);
        this.cloneNewProfile = this.cloneNewProfile.bind(this);
        this.toggleCloneForm = this.toggleCloneForm.bind(this);
    }
    toggleCloneForm() {
        this.setState(pre => ({ isOpenCloneForm: !pre.isOpenCloneForm }))
    }
    cloneNewProfile(name) {
        this.props.cloneProcess(name);
        this.props.history.push('/profile/add')
    }
    componentDidMount() {
        if (!this.props.isPopup) {
            document.title = 'Procedure detail';
            var url = window.location.href;
            var lastPart = url.substr(url.lastIndexOf('/') + 1);
            if (lastPart == 'view') {
                this.props.cancelEditable();
            } else if (lastPart == 'edit') {
                this.props.setEditable();
            }
            available(resolve => setTimeout(resolve, 400));
        }
        let profileId;
        if (this.props.isPopup) {
            profileId = this.props.profileId;
            if (profileId == undefined) {
                this.incrementLoading(2);
            }
        } else {
            profileId = this.props.match.params.id;
        }
        if (profileId != undefined) {
            ProfileService.getDetail(profileId).then(res => {
                let data = res.data;
                this.props.setProfile(data);
                this.incrementLoading();
            })
            ProfileService.getAllMessageForms().then(res => {
                this.props.setMessageForms(res.data);
                this.incrementLoading();
            })
        }
    }
    componentWillUnmount() {
        if (!this.props.isPopup) {
            available1();
        }
    }
    setEditable = () => {
        if (this.props.isPopup) {
            this.props.setEditable();
            let onChange = this.props.onChange;
            if (typeof onChange == 'function') {
                onChange();
            }
        } else {
            this.props.history.push(`/profile/${this.props.match.params.id}/edit`);
        }
    }
    cancelEdit = () => {
        this.setState({ openConfirm: false });
        if (this.props.isPopup) {
            this.props.cancelEditable();
        } else {
            this.props.history.push(`/profile/${this.props.match.params.id}/view`);
        }
    }
    saveProfile() {
        if (this.props.isPopup) {
            let process = this.props.process;
            this.props.onSave(process);
            this.props.setProfile(process);
            this.props.cancelEditable();
        } else {
            this.setState({ isProcessing: true });
            let updateModel = new ProcessReducer.Process().toProfile(this.props.process);
            ProfileService.update(updateModel).then(res => {
                this.props.setProfile(this.props.process);
                let id = this.props.match.params.id;
                this.props.history.push(`/profile/${id}/view`);
                successAlert('This profile has been updated!');
                this.setState({ isProcessing: false });
            }).catch(err => {
                console.error(err);
                errorAlert('Fail to update this profile, please try again!');
                this.setState({ isProcessing: false });
            })
        }
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        var readOnly = this.props.processStatus.readOnly;
        let validateProcessMsg = validateProcess(this.props.process);
        return (<Container className='col-sm-12 row justify-content-center'>
            <div className='col-sm-12'>
                <div className="hungdtq-header">
                    <div>
                        <div className="d-inline-block hungdtq-header-text">
                            <h1>{this.props.process.Name}</h1>
                        </div>
                    </div>
                    <Divider />
                </div>
                <div className='panel-action' style={{ zIndex: 10, position: 'relative' }}>
                    {readOnly ?
                        <div>
                            <Button color='primary' onClick={this.setEditable}>Edit</Button>
                            <Button onClick={this.toggleCloneForm}>Clone</Button>
                        </div> :
                        <div>
                            <Button loading={this.state.isProcessing}
                                disabled={this.state.isProcessing || validateProcessMsg}
                                color='primary'
                                onClick={this.saveProfile}>Save</Button>
                            <Button loading={this.state.isProcessing} disabled={this.state.isProcessing}
                                onClick={() => {
                                    this.setState({ openConfirm: true });
                                }}>Cancel</Button>
                            {validateProcessMsg ? <Message size='mini' negative>
                                <Message.Header>{validateProcessMsg}</Message.Header>
                            </Message> : null}
                        </div>
                    }
                </div>
            </div>
            <Process isPopup={this.props.isPopup} formLoading={this.state.formLoading} />
            <ConfirmModal
                show={this.state.openConfirm}
                onHide={() => { this.setState({ openConfirm: false }) }}
                header="Confirm"
                body="Are you sure? All data you edited will be lost!"
                callback={this.cancelEdit}
            />
            <CloneProfileForm cloneNewProfile={this.cloneNewProfile} toggle={this.toggleCloneForm} isOpen={this.state.isOpenCloneForm} />
        </Container>);
    }
}

class CloneProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
        this.cloneNewProfile = this.cloneNewProfile.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }
    cloneNewProfile(e) {
        e.preventDefault();
        this.props.cloneNewProfile(this.state.name);
    }
    closeForm() {
        this.props.toggle();
        this.setState({ name: '' })
    }
    render() {
        return (<Modal isOpen={this.props.isOpen}>
            <ModalHeader>Clone this procedure</ModalHeader>
            <ModalBody>
                {/* Input name */}
                <Form action='/' onSubmit={this.cloneNewProfile} ref='form'>
                    <Form.Field>
                        <Form.Input label='Procedure Name:' value={this.state.name} required={true}
                            onChange={(e) => { this.setState({ name: e.target.value }) }}
                            placeholder='name of procedure' />
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
        setProfile: (profile) => {
            dispatch(ProcessAction.setProcess(profile));
        },
        setEditable: () => {
            dispatch(enableEditable());
        },
        cancelEditable: () => {
            dispatch(cancelEditable());
        },
        setMessageForms: (messageForms) => {
            dispatch(ProfileAction.setMessageForms(messageForms));
        },
        cloneProcess: (processName) => {
            dispatch(ProcessAction.cloneProcess(processName));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);