import React from 'react';
import { connect } from 'react-redux';
import { ProfileAction } from '../../actions/profile-action';
import { ProcessAction } from '../../actions/process-action';
import { Link } from 'react-router-dom';
import Component from '../common/component'
import { available, PrimaryLoadingPage } from '../common/loading-page'
import { Container, Button, Header, Table, Form, Divider } from 'semantic-ui-react';
import * as ProcessReducer from '../../reducers/process-reducer'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { ProfileService } from '../../services/profile-service';

class ProfileList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            isOpenAddForm: false
        }
        this.toggleAddForm = this.toggleAddForm.bind(this);
        this.addNewProfile = this.addNewProfile.bind(this);
    }
    toggleAddForm() {
        this.setState(pre => ({ isOpenAddForm: !pre.isOpenAddForm }))
    }
    componentDidMount() {
        document.title = 'Profiles';
        available(resolve => setTimeout(resolve, 400));
        ProfileService.getAll().then(res => {
            this.props.fetchAllProfiles(res.data);
            this.incrementLoading();
        })
    }
    addNewProfile(process) {
        this.props.newProcess();
        this.props.updateProcess(process);
        this.props.history.push('/profile/add')
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        var profiles = this.props.profiles;
        return (
            <Container className='col-sm-12 row justify-content-center'>
                <div className='col-sm-12'>
                <div className="hungdtq-header">
                    <div>
                        <div className="d-inline-block hungdtq-header-text">
                            <h1>Profiles</h1>
                        </div>
                        <div className="d-inline-block hungdtq-headerbtn-container">
                            <div className="btn btn-rcm-primary rcm-btn" onClick={this.toggleAddForm}>
                                <a><i className="fas fa-plus"></i></a>
                            </div>
                        </div></div>
                    <Divider />
                </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Profile name</th>
                                {/* <th>Customer</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profiles.map((profile) => (<tr>
                                <td>{profile.Id}</td>
                                <td>{profile.Name}</td>
                                {/* <td>{profile.customer !== null ? profile.customer.name : ''}</td> */}
                                <td>
                                    <Link to={`/profile/${profile.Id}/view`}>View</Link>
                                </td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
                <AddNewProfileForm addNewProfile={this.addNewProfile} toggle={this.toggleAddForm} isOpen={this.state.isOpenAddForm} />
            </Container>);
    }
}

class AddNewProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
        this.addNewProfile = this.addNewProfile.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }
    addNewProfile(e) {
        e.preventDefault();
        let newProcess = new ProcessReducer.Process();
        newProcess.Name = this.state.name;
        this.props.addNewProfile(newProcess);
    }
    closeForm() {
        this.props.toggle();
        this.setState({ name: '' })
    }
    render() {
        return (<Modal isOpen={this.props.isOpen}>
            <ModalHeader>Add new profile</ModalHeader>
            <ModalBody>
                {/* Input name */}
                <Form action='/' onSubmit={this.addNewProfile} ref='form'>
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
        profiles: state.profiles
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllProfiles: (profiles) => {
            dispatch(ProfileAction.setProfiles(profiles));
        },
        newProcess: () => {
            dispatch(ProcessAction.newProcess());
        },
        updateProcess: (process) => {
            dispatch(ProcessAction.editProcess(process));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileList);