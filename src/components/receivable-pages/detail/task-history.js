import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { numAsTime } from '../../../utils/time-converter';
import { Button, Table } from 'semantic-ui-react';
import { describeActionType } from './receivable-detail';

class TaskHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
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
            <a href='' onClick={this.showHistory} style={{ float: 'left' }}><i>{`Today tasks (${todayTask.length})`}</i></a>
            <Modal isOpen={this.state.modal} className='big-modal'>
                <ModalHeader toggle={this.toggle}>
                    {`Today tasks (${todayTask.length})`}
                </ModalHeader>
                <ModalBody>
                    {todayTask.length > 0 ? <table className='table thin' striped>
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
                    </table> : null}
                    {todayTask.length == 0 ? <i>No task need to be done today!</i> : null}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.closeModel}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

export default TaskHistory;