import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Badge } from 'reactstrap';
import { numAsTime } from '../../../utils/time-converter';
import { Button, Label } from 'semantic-ui-react';
import { describeActionType } from './receivable-detail';
import { describeActionStatus } from './task-history';

class TodayTask extends React.Component {
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
                    {todayTask.length > 0 ? <table className='table thin text-center'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Task</th>
                                <th>Start time</th>
                                <th>Evidence</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayTask.map((t, i) => {
                                let color = 'red';
                                switch (t.Status) {
                                    case 1:
                                        color = 'blue'
                                        break;
                                    case 2:
                                        color = 'green'
                                        break;
                                    case 3:
                                        color = 'yellow';
                                        break;
                                }
                                return <tr>
                                    <td>{i + 1}</td>
                                    <td>{describeActionType(t.Name, t.Type)}</td>
                                    <td>{numAsTime(t.StartTime)}</td>
                                    <td>{t.Evidence ? <a target='_blank' href={`/task/${t.Evidence}`}></a> : null}</td>
                                    <th><Label color={color}>{describeActionStatus(t.Status)}</Label></th>
                                </tr>
                            })}
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

export default TodayTask;