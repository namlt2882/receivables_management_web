import React from 'react';
import Process from '../../components/process-pages/process'
import { connect } from 'react-redux';
import { ProfileAction } from './../../actions/profile-action'
import { ProcessAction, cancelEditable, enableEditable } from './../../actions/process-action'
import './profile.scss'
import Component from '../common/component'
import { available, PrimaryLoadingPage } from '../common/loading-page';
import { Container, Button, Divider } from 'semantic-ui-react';
import { ProfileService } from '../../services/profile-service'

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 2,
            formLoading: false
        }
    }
    componentDidMount() {
        document.title = 'Profile detail';
        var url = window.location.href;
        var lastPart = url.substr(url.lastIndexOf('/') + 1);
        if (lastPart == 'view') {
            this.props.cancelEditable();
        } else if (lastPart == 'edit') {
            this.props.setEditable();
        }
        available(resolve => setTimeout(resolve, 400));
        this.props.getProfile(this.props.match.params.id).then(res => {
            this.incrementLoading();
        })
        this.props.getAllMessageForms().then(res => {
            this.incrementLoading();
        });
    }
    setEditable = () => {
        this.props.history.push(`/profile/${this.props.match.params.id}/edit`);
    }
    setUneditable = () => {
        if (window.confirm('Are you sure? All data you edited will be lost!')) {
            this.props.history.push(`/profile/${this.props.match.params.id}/view`);
        }
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        var readOnly = this.props.processStatus.readOnly;
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
                    {readOnly ? <Button color='primary' onClick={this.setEditable}>Edit</Button> :
                        <div>
                            <Button color='primary'>Save</Button>
                            <Button onClick={this.setUneditable}>Cancel</Button>
                        </div>
                    }
                </div>
            </div>
            <Process showProcessName={false} formLoading={this.state.formLoading} />
        </Container>);
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
        cancelEditable: () => {
            dispatch(cancelEditable());
        },
        getProfile: (id) => {
            return ProfileService.getDetail(id).then(res => {
                dispatch(ProcessAction.setProcess(res.data));
            });

        },
        getAllMessageForms: () => {
            return ProfileService.getAllMessageForms().then(res => {
                dispatch(ProfileAction.setMessageForms(res.data));
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);