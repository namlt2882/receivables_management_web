import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Badge } from 'reactstrap';
import { numAsDate, numAsTime } from '../../../utils/time-converter';
import Component from '../../common/component';
import { Button, Divider } from 'semantic-ui-react';

class TaskHistory extends Component {
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
        return (<div>
            <a href='' onClick={this.showHistory} style={{ float: 'right' }}><i>Today task</i></a>
            <Modal isOpen={this.state.modal} className='big-modal'>
                <ModalHeader toggle={this.toggle}>
                    {this.state.showTodayTask ? 'Today task' : 'Task history'}
                </ModalHeader>
                <ModalBody>

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.closeModel}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

export default TaskHistory;