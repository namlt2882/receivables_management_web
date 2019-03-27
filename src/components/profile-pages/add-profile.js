import React from 'react';
import Process from '../../components/process-pages/process'
import { connect } from 'react-redux';
import { ProcessAction, enableEditable } from './../../actions/process-action'
import './profile.scss'
import Component from '../common/component'
import { available, PrimaryLoadingPage } from '../common/loading-page';
import { ProfileService } from '../../services/profile-service'
import { ProfileAction } from './../../actions/profile-action'
import * as ProcessReducer from '../../reducers/process-reducer'
import { Button, Container, Divider } from 'semantic-ui-react';
import { successAlert, errorAlert } from '../common/my-menu';

class AddProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
            formLoading: false
        }
        this.cancel = this.cancel.bind(this);
        this.createNewProfile = this.createNewProfile.bind(this);
    }
    componentDidMount() {
        document.title = 'New profile';
        available(resolve => setTimeout(resolve, 400));
        this.props.setEditable();
        this.props.getAllMessageForms().then(res => { this.incrementLoading() })
    }
    cancel() {
        if (window.confirm('Are you sure? All data you input will be lost!')) {
            this.props.history.push('/profile')
        }
    }

    createNewProfile() {
        this.setState({ formLoading: true });
        this.props.createNewProfile(this.props.process).then(res => {
            successAlert('Insert successfully!');
            this.props.history.push(`/profile`)
        }).catch(err => {
            let status = err.response.status;
            console.log(`http status: ${status}`);
            errorAlert('Something went wrong! Please try again later!');
            this.setState({ formLoading: false });
        });
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        return (<Container className='col-sm-12 row justify-content-center'>
            <div className='col-sm-12'>
                <div className="hungdtq-header">
                    <div>
                        <div className="d-inline-block hungdtq-header-text">
                            <h1>Add new Profiles</h1>
                        </div>
                    </div>
                    <Divider />
                </div>
                <div className='panel-action' style={{ zIndex: 10, position: 'relative' }}>
                    <Button color='primary' onClick={this.createNewProfile}>Save</Button>
                    <Button onClick={this.cancel}>Cancel</Button>
                </div>
            </div>
            <Process formLoading={this.state.formLoading} />
        </Container >);
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
        setEditable: () => {
            dispatch(enableEditable());
        },
        newProcess: () => {
            dispatch(ProcessAction.newProcess());
        },
        getAllMessageForms: () => {
            return ProfileService.getAllMessageForms().then(res => {
                dispatch(ProfileAction.setMessageForms(res.data));
            })
        },
        createNewProfile: (profile, callback) => {
            return ProfileService.create(new ProcessReducer.Process().toProfile(profile));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddProfile);