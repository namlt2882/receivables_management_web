import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Button } from 'semantic-ui-react';
import { ReceivableService } from '../../../services/receivable-service';

class EditReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            loadingForm: false,
            prepaidAmount: 0,
            debtAmount: 0,
            customerId: 0,
            collectorId: 0
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateReceivable = this.updateReceivable.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.updateCollector = this.updateCollector.bind(this);
    }
    refreshData() {
        let receivable = this.props.receivable;
        let curCollector = receivable.collector;
        this.setState({
            prepaidAmount: receivable.PrepaidAmount,
            debtAmount: receivable.DebtAmount,
            customerId: receivable.CustomerId,
            collectorId: curCollector.Id,
        })
    }
    openModal(e) {
        e.preventDefault();
        this.refreshData();
        this.setState({ modal: true });
    }
    closeModal() {
        this.setState({ loadingForm: false, modal: false });
    }
    updateReceivable() {
        this.setState({ loadingForm: true })
        let origin = this.props.receivable;
        let rei = {
            PrepaidAmount: this.state.prepaidAmount,
            DebtAmount: this.state.debtAmount,
            CustomerId: this.state.customerId,
            LocationId: origin.LocationId,
            Id: origin.Id
        }
        ReceivableService.update(rei).then(res => {
            origin.PrepaidAmount = this.state.prepaidAmount;
            origin.DebtAmount = this.state.debtAmount;
            origin.CustomerId = this.state.customerId;
            let newCustomer = this.props.customerList.find(cu => cu.Id === this.state.customerId);
            if (newCustomer) {
                origin.customer = newCustomer;
            }
            if (origin.collector) {
                if (origin.collector.Id !== this.state.collectorId) {
                    //update collector
                    this.updateCollector();
                } else {
                    this.props.updateReceivable(origin);
                    this.closeModal();
                }
            } else {
                //update collector
                this.updateCollector();
            }
        }).catch(err => {
            alert('Fail to update receivable!');
            this.setState({ loadingForm: false })
        })
    }
    updateCollector() {
        let origin = this.props.receivable;
        let data = {
            CollectorId: this.state.collectorId,
            ReceivableId: origin.Id
        }
        ReceivableService.changeCollector(data).then(res => {
            let newCollector = this.props.collectorList.find(co => co.Id === this.state.collectorId);
            if (newCollector) {
                origin.collector = newCollector;
                this.props.updateReceivable(origin);
            }
            this.closeModal();
        }).catch(err => {
            alert('Fail to update collector!');
            this.setState({ loadingForm: false })
        })
    }
    render() {
        return (<div>
            <a href='' onClick={this.openModal} style={{ marginRight: '15px' }}>Edit</a>
            <Modal isOpen={this.state.modal}>
                <ModalHeader>Update information of receivable</ModalHeader>
                <ModalBody>
                    <Form loading={this.state.loadingForm} onSubmit={this.updateReceivable}>
                        <Form.Field>
                            <label>Debt amount:</label>
                            <input type='number' min='0' required value={this.state.debtAmount}
                                onChange={(e) => { this.setState({ debtAmount: parseInt(e.target.value) }) }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Prepaid amount:</label>
                            <input type='number' min='0' max={this.state.debtAmount} required value={this.state.prepaidAmount}
                                onChange={(e) => { this.setState({ prepaidAmount: parseInt(e.target.value) }) }} />
                        </Form.Field>
                        <Form.Field>
                            <label>Collector:</label>
                            <select className='form-control' value={this.state.collectorId}
                                onChange={(e) => { this.setState({ collectorId: e.target.value }) }}>
                                <option value='-1'>--</option>
                                {this.props.collectorList.map(co =>
                                    <option value={co.Id}>{`${co.FirstName} ${co.LastName}`}</option>)}
                            </select>
                            <span style={{
                                color: 'red',
                                display: this.state.collectorId !== '-1' ? 'none' : 'block'
                            }}>Please choose collector</span>
                        </Form.Field>
                        <Form.Field>
                            <label>Customer:</label>
                            <select className='form-control' value={this.state.customerId}
                                onChange={(e) => { this.setState({ customerId: parseInt(e.target.value) }) }}>
                                {this.props.customerList.map(cu =>
                                    <option value={cu.Id}>{cu.Name}</option>)}
                            </select>
                        </Form.Field>
                        <button ref='submit' type='submit' style={{ display: 'none' }}></button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"
                        disabled={this.state.collectorId === '-1'}
                        onClick={() => { this.refs.submit.click() }}>OK</Button>
                    <Button color="secondary" onClick={this.closeModal}>Close</Button>
                </ModalFooter>
            </Modal>
        </div >);
    }
}

export default EditReceivable;