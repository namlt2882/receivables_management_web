import React, { Component } from 'react';
import { Button, Form, Checkbox } from 'semantic-ui-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ReceivableService } from '../../../services/receivable-service';
import { dateToInt } from '../../../utils/time-converter'

class ChangeStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            showTodayTask: true,
            receivable: this.props.receivable,
            status: this.props.receivable.CollectionProgress.Status,
            formLoading: false
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
    changeStatus() {
        if (window.confirm('Are you sure? This action can not be rollback!')) {
            this.setState({ formLoading: true });
            ReceivableService.closeReceivable(this.state.receivable.Id).then(res => {
                this.state.receivable.CollectionProgress.Status = 2;
                let closedDay = dateToInt(new Date());
                this.state.receivable.ClosedDay = closedDay;
                this.props.updateReceivable(this.state.receivable);
                this.setState({ formLoading: false });
                this.closeModal();
            })
        }
    }
    render() {
        let receivable = this.state.receivable;
        let debtor = this.props.debtor;
        return (<div>
            <Button color='primary' onClick={this.openForm}>Close</Button>
            <Modal isOpen={this.state.modal}>
                <ModalHeader toggle={this.toggle}>Close {debtor ? ` ${debtor.Name}'s` : ''} receivable</ModalHeader>
                <ModalBody>
                    <Form onSubmit={this.changeStatus} loading={this.state.formLoading}>
                        <Form.Field>
                            <b>Debt amount:</b>{` ${receivable.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
                        </Form.Field>
                        <Form.Field control={Checkbox} label='Money is collected?' />
                        <button ref='submit' type='submit' style={{ display: 'none' }}></button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => { this.refs.submit.click() }}>OK</Button>
                    <Button color="secondary" onClick={this.closeModal}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

export default ChangeStatus;