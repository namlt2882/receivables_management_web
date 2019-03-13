import React, { Component } from 'react';
import { Button, Form, Checkbox } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ReceivableService } from '../../../services/receivable-service';
import { dateToInt } from '../../../utils/time-converter'
import { AuthService } from '../../../services/auth-service';

class ChangeStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            showTodayTask: true,
            receivable: this.props.receivable,
            status: this.props.receivable.CollectionProgress.Status,
            isPayed: false
        }
        this.openForm = this.openForm.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
    }
    openForm(e) {
        e.preventDefault();
        this.setState({
            modal: true
        });
    }
    closeModal() {
        this.setState({ modal: false });
    }
    changeStatus(isPayed) {
        let message = 'Money is collected and will close this case?';
        if (!isPayed) {
            message = 'Stop this case?';
        }
        if (window.confirm(message)) {
            let data = {
                Id: this.state.receivable.Id,
                isPayed: isPayed
            }
            ReceivableService.closeReceivable(data).then(res => {
                let rs = res.data;
                this.state.receivable.CollectionProgress.Status = rs.Status;
                this.state.receivable.ClosedDay = rs.ClosedTime;
                this.props.updateReceivable(this.state.receivable);
            })
        }
    }
    render() {
        return (<div>
            {AuthService.isCollector() ?
                <div style={{ marginBottom: '10px', marginLeft: '20%' }}>
                    <Button color='blue' onClick={() => { this.changeStatus(true) }}>Finish</Button>
                </div> : null}

            {AuthService.isCollector() ?
                <div style={{marginLeft: '20%' }}>
                    <Button color='red' onClick={() => { this.changeStatus(false) }}>Stop</Button>
                </div> : null}
        </div>);
    }
}

export default ChangeStatus;