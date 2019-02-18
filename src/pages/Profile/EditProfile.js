import React, { Component } from 'react';
import Process from './../../components/Process/Process'
import { connect } from 'react-redux';
import { ProcessAction, ProcessActionRequest, cancelEditable, enableEditable } from './../../actions/ProcessAction'
import './ProfilePage.scss'

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.getProcessDetailRequest(1);
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
            dispatch(ProcessActionRequest.getProcessDetailRequest(id));
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);