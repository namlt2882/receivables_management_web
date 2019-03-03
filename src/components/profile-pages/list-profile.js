import React from 'react';
import { connect } from 'react-redux';
import { ProfileAction } from '../../actions/profile-action';
import { ProcessAction } from '../../actions/process-action';
import { Link } from 'react-router-dom';
import Component from '../common/component'
import { available, PrimaryLoadingPage } from '../common/loading-page'
import { Container, Button, Header, Table, Form } from 'semantic-ui-react';
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
            return <PrimaryLoadingPage/>
        }
        var profiles = this.props.profiles;
        return (<div className='col-sm-12 row justify-content-center align-self-center'>
            <Container>
                <Header className='text-center'>Profiles</Header>
                <Button primary onClick={this.toggleAddForm}>Add Profile</Button>
                <Table className="table-hover">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Id</Table.HeaderCell>
                            <Table.HeaderCell>Profile name</Table.HeaderCell>
                            {/* <th>Customer</th> */}
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {profiles.map((profile) => (<Table.Row>
                            <Table.Cell>{profile.Id}</Table.Cell>
                            <Table.Cell>{profile.Name}</Table.Cell>
                            {/* <td>{profile.customer !== null ? profile.customer.name : ''}</td> */}
                            <Table.Cell>
                                <Link to={`/profile/${profile.Id}/view`}>View</Link>
                            </Table.Cell>
                        </Table.Row>))}
                    </Table.Body>
                </Table>
                <AddNewProfileForm addNewProfile={this.addNewProfile} toggle={this.toggleAddForm} isOpen={this.state.isOpenAddForm} />
            </Container>
        </div>);
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
            dispatch(ProfileAction.fetchProfiles(profiles));
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