import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { numAsTime } from '../../../utils/time-converter';
import { Button, Table } from 'semantic-ui-react';
import { describeActionType } from './receivable-detail';

class TaskHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            showTodayTask: true
        }
        this.showHistory = this.showHistory.bind(this);
        this.closeModel = this.closeModel.bind(this);
    }
    componentDidMount() {

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
        let todayTask = this.props.todayTask;
        return (<div>
            <a href='' onClick={this.showHistory} style={{ float: 'left' }}><i>Today task</i></a>
            <Modal isOpen={this.state.modal} className='big-modal'>
                <ModalHeader toggle={this.toggle}>
                    {this.state.showTodayTask ? 'Today task' : 'Task history'}
                </ModalHeader>
                <ModalBody>
                    <Table className='info-table' striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Task</th>
                                <th>Start time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayTask.map((t, i) => (<tr>
                                <td>{i + 1}</td>
                                <td>{describeActionType(t.Name, t.Type)}</td>
                                <td>{numAsTime(t.StartTime)}</td>
                            </tr>))}
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.closeModel}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

export default TaskHistory;