import React, { Component } from 'react';
import Process from './../../components/Process/Process'
import { connect } from 'react-redux';
import { ProfileRequest } from './../../actions/ProfileActions'
import { ProcessAction, enableEditable } from './../../actions/ProcessAction'
import './ProfilePage.scss'

class AddProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.goBack = this.goBack.bind(this);
        this.createNewProfile = this.createNewProfile.bind(this);
    }
    componentDidMount() {
        this.props.setEditable();
        this.props.newProcess();
        this.props.fetchMessageForms();
    }
    goBack() {
        var { history } = this.props;
        history.goBack();
    }

    createNewProfile() {
        this.props.createNewProfile(this.props.process, (data) => {
            this.goBack();
        });
    }

    render() {
        return (<div>
            <div className='row'>
                <div className='col-sm-12'>
                    <div className='panel-action'>
                        <button className='btn btn-primary' onClick={this.createNewProfile}>Save</button>
                        <button className='btn btn-default' onClick={this.goBack}>Cancel</button>
                    </div>
                </div>
            </div>
            <Process />
        </div>);
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
        fetchMessageForms: () => {
            dispatch(ProfileRequest.fetchMessageForms());
        },
        createNewProfile: (process, callback) => {
            dispatch(ProfileRequest.createNewProfile(process, callback));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddProfile);