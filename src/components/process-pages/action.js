import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProcessActionTypes } from '../../reducers/process-reducer';
library.add(faTrashAlt);

class Action extends Component {
    constructor(props) {
        super(props);
        let action = this.props.action;
        let time = action.StartTime.toString();
        if (action.StartTime < 1000) {
            time = '0' + time;
        }
        let _24Array = new Array(25).fill({ val: 0 })
            .map((ele, i) => ({ val: i }))
            .filter(ele => 7 <= ele.val && 22 >= ele.val);
        let _60Array = new Array(60).fill({ val: 0 })
            .map((ele, i) => ({ val: i }))
            .filter(ele => ele.val % 5 == 0);
        this.state = {
            messageFormId: action.ProfileMessageFormId === null ? '-1' : action.ProfileMessageFormId,
            name: action.Name,
            type: action.Type,
            frequency: action.Frequency,
            hour: parseInt(time.substring(0, 2)),
            minute: parseInt(time.substring(2)),
            _24Array: _24Array,
            _60Array: _60Array
        }
        this.editType = this.editType.bind(this);
        this.editMessageForm = this.editMessageForm.bind(this);
        this.deleteAction = this.deleteAction.bind(this);
        this.editFrequency = this.editFrequency.bind(this);
        this.editHour = this.editHour.bind(this);
        this.editMinute = this.editMinute.bind(this);
    }

    deleteAction = () => {
        this.props.deleteAction(this.props.action.Id);
    }

    editFrequency(e) {
        let action = this.props.action;
        let value = e.target.value;
        if (value === '') {
            value = 0;
        } else {
            value = parseInt(value);
            if (value > this.props.duration) {
                value = this.props.duration;
            }
        }
        e.target.value = value;
        action.Frequency = value;
        this.props.updateAction(action);
        this.setState({ frequency: action.Frequency })
    }

    editType = (e) => {
        var actionName;
        let action = this.props.action;
        if (e.target.value !== 4) {
            actionName = ProcessActionTypes[e.target.value].name;
        } else {
            actionName = 'Notification';
        }
        action.Type = parseInt(e.target.value);
        action.Name = actionName;
        this.props.updateAction(action);
        this.setState({ actionType: action.Type });
    }

    editMessageForm = (e) => {
        let action = this.props.action;
        let value;
        if (e.target.value === '-1') {
            action.ProfileMessageFormId = null;
            value = '-1'
        } else {
            action.ProfileMessageFormId = parseInt(e.target.value);
            value = e.target.value
        }
        this.setState({
            messageFormId: value
        })
        this.props.updateAction(action);
    }

    editName = (e) => {
        if (e.target.value.trim() === '') {
            e.target.value = '';
        }
        let action = this.props.action;
        action.Name = e.target.value;
        this.setState({
            name: action.Name
        })
        this.props.updateAction(action);
    }

    editStartTime(hour, minute) {
        this.setState({
            hour: hour,
            minute: minute
        })
        let time = '' + (hour < 10 ? `0${hour}` : hour) + (minute < 10 ? `0${minute}` : minute);
        time = parseInt(time);
        this.props.action.StartTime = time;
        this.props.updateAction(this.props.action);
    }

    editHour(e) {
        let hour = parseInt(e.target.value);
        let minute = this.state.minute;
        if (hour == 22) {
            minute = 0;
        }
        this.editStartTime(hour, minute);
    }

    editMinute(e) {
        let hour = this.state.hour;
        let minute = parseInt(e.target.value);
        if (hour == 24) {
            minute = 0;
        }
        this.editStartTime(hour, minute);
    }

    render() {
        let action = this.props.action;

        // get message form
        return (<tr>
            <td width='5%'>
                {this.props.no}
            </td>
            <td width='20%'>
                {/* Input name */}
                {action.Type === 3 ? <input value={this.state.name}
                    readOnly={action.Type === 3 ? false : true} required={true} onChange={this.editName} />
                    : <span>{action.Name}</span>}
            </td>
            <td width='15%'>
                {/* Select action type */}
                <select className='form-control' onChange={this.editType} value={this.state.actionType}>
                    {ProcessActionTypes.map(({ type, name }) =>
                        <option value={type} selected={type === action.Type}>
                            {name}
                        </option>)}
                </select>
            </td>
            <td width='20%' style={{ boxSizing: 'border-box' }}>
                {/* Start time */}
                <select style={{ width: '40%', display: 'inline-block', marginLeft: '10%' }} value={this.state.hour} onChange={this.editHour}>
                    {this.state._24Array.map((ele, i) =>
                        <option value={ele.val}>{ele.val}</option>)}
                </select>
                <select style={{ width: '40%', display: 'inline-block', marginRight: '10%' }} value={this.state.minute} onChange={this.editMinute}>
                    {this.state._60Array.map((ele, i) =>
                        <option value={ele.val}>{ele.val}</option>)}
                </select>
            </td>
            <td width='10%'>
                {/* Frequency */}
                <input type='number' min='1' max={this.props.duration} value={this.state.frequency}
                    onChange={this.editFrequency} />
            </td>
            <td width='25%'>
                {/* Message form */}
                {action.Type !== 0 && action.Type !== 1 ? null :
                    <select
                        onChange={this.editMessageForm} value={this.state.messageFormId}>
                        <option value='-1'>--</option>
                        {this.props.messageForms
                            .filter(mf => mf.Type === action.Type)
                            .map((mf) =>
                                <option value={mf.Id}
                                    selected={mf.Id === action.ProfileMessageFormId}>{mf.Name}</option>
                            )}
                    </select>}
            </td>
            <td width='5%'>
                {/* Actions */}
                <FontAwesomeIcon icon='trash-alt' size='sm' color='black' className='icon-btn'
                    onClick={this.deleteAction} />
            </td>
        </tr>);
    }
}
const mapStateToProps = state => {
    return {
        messageForms: state.messageForms
    }
}
export default connect(mapStateToProps)(Action);