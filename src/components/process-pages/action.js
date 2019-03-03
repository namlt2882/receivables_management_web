import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProcessActionTypes } from '../../reducers/process-reducer'
import { Table } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faTrashAlt);

class Action extends Component {
    constructor(props) {
        super(props);
        let action = this.props.action;
        let time = action.StartTime.toString();
        if (action.StartTime < 1000) {
            time = '0' + time;
        }
        this.state = {
            messageFormId: action.ProfileMessageFormId === null ? '-1' : action.ProfileMessageFormId,
            name: action.Name,
            type: action.Type,
            frequency: action.Frequency,
            hour: parseInt(time.substring(0, 2)),
            minute: parseInt(time.substring(2))
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
        if (hour == 24) {
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
        let _24Array = new Array(25).fill(0);
        let _60Array = new Array(61).fill(0);
        // get message form
        return (<Table.Row>
            <Table.Cell>
                {this.props.no}
            </Table.Cell>
            <Table.Cell>
                {/* Input name */}
                {action.Type === 3 ? <input value={this.state.name}
                    readOnly={action.Type === 3 ? false : true} required={true} onChange={this.editName} />
                    : <span>{action.Name}</span>}
            </Table.Cell>
            <Table.Cell>
                {/* Select action type */}
                <select className='form-control' onChange={this.editType} value={this.state.actionType}>
                    {ProcessActionTypes.map(({ type, name }) =>
                        <option value={type} selected={type === action.Type}>
                            {name}
                        </option>)}
                </select>
            </Table.Cell>
            <Table.Cell>
                {/* Start time */}
                <select value={this.state.hour} onChange={this.editHour}>
                    {_24Array.map((tmp, i) =>
                        <option value={i}>{i}</option>)}
                </select>
                <select value={this.state.minute} onChange={this.editMinute}>
                    {_60Array.map((tmp, i) =>
                        <option value={i}>{i}</option>)}
                </select>
            </Table.Cell>
            <Table.Cell>
                {/* Frequency */}
                <input type='number' min='1' max={this.props.duration} value={this.state.frequency}
                    onChange={this.editFrequency} />
            </Table.Cell>
            <Table.Cell>
                {/* Message form */}
                {action.Type !== 0 && action.Type !== 1 ? null :
                    <select
                        onChange={this.editMessageForm} value={this.state.messageFormId}>
                        <option value='-1'>--</option>
                        {this.props.messageForms
                            .filter(mf => mf.Type !== action.Type)
                            .map((mf) =>
                                <option value={mf.Id}
                                    selected={mf.Id === action.ProfileMessageFormId}>{mf.Name}</option>
                            )}
                    </select>}
            </Table.Cell>
            <Table.Cell>
                {/* Actions */}
                <FontAwesomeIcon icon='trash-alt' size='sm' color='black' className='icon-btn'
                    onClick={this.deleteAction} />
            </Table.Cell>
        </Table.Row>);
    }
}
const mapStateToProps = state => {
    return {
        messageForms: state.messageForms
    }
}
export default connect(mapStateToProps)(Action);