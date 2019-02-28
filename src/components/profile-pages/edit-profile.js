import React from 'react';
import Process from '../../components/process-pages/process'
import { connect } from 'react-redux';
import { ProfileRequest } from './../../actions/profile-action'
import { ProcessAction, ProfileProcessRequest, cancelEditable, enableEditable } from './../../actions/process-action'
import './profile.scss'
import Component from '../common/component'
import { available } from '../common/loading-page';

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        document.title = 'Profile detail';
        available(resolve => setTimeout(resolve, 400));
        this.props.getProcessDetailRequest(1);
        this.props.fetchMessageForms();
    }
    setEditable = () => {
        this.props.setEditable();
    }
    setUneditable = () => {
        this.props.cancelEditable();
    }
    render() {
        var readOnly = this.props.processStatus.readOnly;
        return (<div>
            <div className='row'>
                <div className='col-sm-12'>
                    <div className='panel-action'>
                        {readOnly ? <button className='btn btn-primary' onClick={this.setEditable}>Edit</button> :
                            <div>
                                <button className='btn btn-primary'>Save</button>
                                <button className='btn btn-default' onClick={this.setUneditable}>Cancel</button>
                            </div>
                        }
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
        cancelEditable: () => {
            dispatch(cancelEditable());
        },
        getProcessDetailRequest: (id) => {
            dispatch(ProfileProcessRequest.getProcessDetailRequest(id));
        },
        fetchMessageForms: () => {
            dispatch(ProfileRequest.fetchMessageForms());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);