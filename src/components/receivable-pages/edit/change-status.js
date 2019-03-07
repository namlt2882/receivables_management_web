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
            formLoading: false,
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
            message = 'Cancel this case?';
        }
        if (window.confirm(message)) {
            // this.setState({ formLoading: true });
            let data = {
                Id: this.state.receivable.Id,
                isPayed: isPayed
            }
            ReceivableService.closeReceivable(data).then(res => {
                let rs = res.data;
                this.state.receivable.CollectionProgress.Status = rs.Status;
                this.state.receivable.ClosedDay = rs.ClosedTime;
                this.props.updateReceivable(this.state.receivable);
                // this.setState({ formLoading: false });
                // this.closeModal();
            })
        }
    }
    render() {
        let receivable = this.state.receivable;
        let debtor = this.props.debtor;
        return (<div>
            {AuthService.isCollector() ?
                <Button color='green' onClick={() => { this.changeStatus(true) }}>Close</Button> : null}
            {AuthService.isCollector() ?
                <Button color='orange' onClick={() => { this.changeStatus(false) }}>Cancel</Button> : null}
            {/* <Modal isOpen={this.state.modal}>
                <ModalHeader toggle={this.toggle}>Close {debtor ? ` ${debtor.Name}'s` : ''} receivable</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.changeStatus} loading={this.state.formLoading}>
                        <Form.Field>
                            <b>Amount need to be collected:</b>{` ${(receivable.DebtAmount - receivable.PrepaidAmount).toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
                        </Form.Field>
                        <Form.Field control={Checkbox} label='Money is collected?'
                            checked={this.state.isPayed} onChange={() => {
                                this.setState(pre => ({
                                    isPayed: !pre.isPayed
                                }))
                            }} />
                        <button ref='submit' type='submit' style={{ display: 'none' }}></button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => { this.refs.submit.click() }}>OK</Button>
                    <Button color="secondary" onClick={this.closeModal}>Cancel</Button>
                </ModalFooter>
            </Modal> */}
        </div>);
    }
}

export default ChangeStatus;