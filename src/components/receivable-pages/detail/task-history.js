import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Badge } from 'reactstrap';
import { numAsDate, numAsTime } from '../../../utils/time-converter';
import { Button, Divider, Label } from 'semantic-ui-react';

class TaskHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            total: 0,
            stages: this.props.stages
        }
        this.showHistory = this.showHistory.bind(this);
        this.closeModel = this.closeModel.bind(this);
    }
    componentDidMount() {
        let stages = this.state.stages;
        stages.forEach(stage => {
            stage.complete_task = stage.Actions.filter(a => a.Status !== 1 && a.Type !== 0 && a.Type !== 1);
            this.setState(pre => ({
                total: pre.total + stage.complete_task.length
            }))
        })
        this.setState({ stages: stages });
    }
    showHistory(e) {
        e.preventDefault();
        this.setState({
            modal: true
        });
    }
    closeModel() {
        this.setState({ modal: false });
    }
    render() {
        let stages = this.state.stages;
        let isEmpty = true;
        return (<div>
            <a href='' onClick={this.showHistory} style={{ float: 'left' }}><i>{`Task history (${this.state.total})`}</i></a>
            <Modal isOpen={this.state.modal} className='big-modal'>
                <ModalHeader toggle={this.toggle}>{`Task history (${this.state.total})`}</ModalHeader>
                <ModalBody>
                    {stages.map((stage, i) => {
                        let actions = stage.complete_task;
                        if (!actions) {
                            return null;
                        }
                        if (isEmpty && actions.length > 0) {
                            isEmpty = false;
                        }
                        if (actions.length <= 0) {
                            return null;
                        }
                        return <div>
                            {i >= 1 ? <Divider /> : null}
                            <span><h3>{stage.Name}</h3></span>
                            <table className='table thin text-center'>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Time</th>
                                        <th>Evidence</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actions.map((action, i) => {
                                        return <ActionRecord action={action} key={i} />
                                    })}
                                </tbody>
                            </table>
                        </div>
                    })}
                    {isEmpty ? <span>Sorry, task history is empty!</span> : null}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.closeModel}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

class ActionRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let action = this.props.action;
        let date = numAsDate(action.ExcutionDay);
        let time = numAsTime(action.StartTime);
        let color = 'orange';
        switch (action.Status) {
            case 0:
                color = 'red'
                break;
            case 1:
                color = 'gray'
                break;
            case 2:
                color = 'green'
                break;
        }
        return (<tr>
            <td>{action.Name}</td>
            <td>
                <span>At{` ${date} ${time}`}</span>
            </td>
            <td>{action.Evidence ? <a target='_blank' href={`/task/${action.Evidence}`}></a> : null}</td>
            <td>
                <Label color={color}>{describeActionStatus(action.Status)}</Label>
            </td>
        </tr>);
    }
}

const describeActionStatus = (status) => {
    switch (status) {
        case 0:
            return 'Cancel';
        case 1:
            return 'Not done';
        case 2:
            return 'Done';
        default:
            return 'Late';
    }
}

export default TaskHistory;