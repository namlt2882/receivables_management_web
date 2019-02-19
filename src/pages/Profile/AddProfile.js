import React, { Component } from 'react';
import Process from './../../components/Process/Process'
import { connect } from 'react-redux';
import { ProcessAction, ProcessActionRequest, cancelEditable, enableEditable } from './../../actions/ProcessAction'
import './ProfilePage.scss'

class AddProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.goBack = this.goBack.bind(this);
    }
    componentDidMount() {
        this.props.setEditable();
        this.props.newProcess();
    }
    goBack() {
        var { history } = this.props;
        history.goBack();
    }

    render() {
        return (<div>
            <div className='row'>
                <div className='col-sm-12'>
                    <div className='panel-action'>
                        <button className='btn btn-primary'>Save</button>
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
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddProfile);