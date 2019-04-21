import { MDBDataTable } from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button, Container, Divider, Form } from 'semantic-ui-react';
import { ProcessAction } from '../../actions/process-action';
import { ProfileAction } from '../../actions/profile-action';
import * as ProcessReducer from '../../reducers/process-reducer';
import { ProfileService } from '../../services/profile-service';
import Component from '../common/component';
import { available, PrimaryLoadingPage } from '../common/loading-page';

class ProfileList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            isOpenAddForm: false
        }
        this.toggleAddForm = this.toggleAddForm.bind(this);
        this.addNewProfile = this.addNewProfile.bind(this);
        this.pushData = this.pushData.bind(this);
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
    pushData() {
        let newData = { ...data };
        newData.rows = this.props.profiles.map((profile, i) => {
            return {
                No: (i + 1),
                Name: profile.Name,
                Actions: <Link to={`/profile/${profile.Id}/view`}>View</Link>
            }
        })
        return newData;
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let data1 = this.pushData();
        return (
            <Container className='col-sm-12 row justify-content-center'>
                <div className='col-sm-12 middle-content-table'>
                    <div className="hungdtq-header">
                        <div>
                            <div className="d-inline-block hungdtq-header-text">
                                <h1>Procedures</h1>
                            </div>
                            <div className="d-inline-block hungdtq-headerbtn-container">
                                <div className="btn btn-rcm-primary rcm-btn" onClick={this.toggleAddForm}>
                                    <a><i className="fas fa-plus"></i></a>
                                </div>
                            </div></div>
                        <Divider />
                    </div>
                    <MDBDataTable
                        className='hide-last-row'
                        striped
                        bordered
                        data={data1} />
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
            <ModalHeader>Add new procedure</ModalHeader>
            <ModalBody>
                {/* Input name */}
                <Form action='/' onSubmit={this.addNewProfile} ref='form'>
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

const data = {
    columns: [
        {
            label: '#',
            field: 'No',
            width: 50
        },
        {
            label: 'Procedure Name',
            field: 'Name',
            width: 300
        },
        {
            label: '',
            field: '',
            width: 50
        },
    ],
    rows: []
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