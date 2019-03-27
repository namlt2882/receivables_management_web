import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form, Button, Checkbox } from 'semantic-ui-react';
import { ReceivableService } from '../../../services/receivable-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { numAsDate, dateToInt } from '../../../utils/time-converter';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { errorAlert, successAlert } from '../../common/my-menu';
import MyToolTip from '../../common/my-tooltip';
library.add(faPen);

class EditReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            loadingForm: false,
            prepaidAmount: 0,
            debtAmount: 0,
            collectorId: 0,
            isPending: false,
            payableDay: new Date(),
            collector: null
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateReceivable = this.updateReceivable.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.updateCollector = this.updateCollector.bind(this);
        this.assignReceivable = this.assignReceivable.bind(this);
        this.validate = this.validate.bind(this);
        this.onChangeCollector = this.onChangeCollector.bind(this);
    }
    refreshData() {
        let receivable = this.props.receivable;
        let curCollector = receivable.collector;
        let collectorId = curCollector ? curCollector.Id : null;
        this.setState({
            prepaidAmount: receivable.PrepaidAmount,
            debtAmount: receivable.DebtAmount,
            collectorId: collectorId,
            isPending: receivable.CollectionProgress.Status === 4,
            payableDay: receivable.PayableDay !== null ?
                new Date(numAsDate(receivable.PayableDay)) : new Date(),
            collector: this.props.collectorList.find(co => co.Id === collectorId)
        })
    }
    openModal() {
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
            Id: origin.Id
        }
        let isPending = this.state.isPending;
        let status = origin.CollectionProgress.Status;
        ReceivableService.update(rei).then(res => {
            origin.PrepaidAmount = this.state.prepaidAmount;
            origin.DebtAmount = this.state.debtAmount;
            if (status === 4) {
                // when origin is pending
                if (!isPending) {
                    // when isPending = false
                    this.assignReceivable();
                } else {
                    successAlert('Update receivable successfully!');
                    this.props.updateReceivable(origin);
                    this.closeModal();
                }
            } else if (status === 1) {
                // when origin is collecting
                if (origin.collector) {
                    if (origin.collector.Id !== this.state.collectorId) {
                        //update collector
                        this.updateCollector();
                    } else {
                        successAlert('Update receivable successfully!');
                        this.props.updateReceivable(origin);
                        this.closeModal();
                    }
                } else {
                    //update collector
                    this.updateCollector();
                }
            }
        }).catch(err => {
            errorAlert('Fail to update receivable!');
            this.setState({ loadingForm: false })
        })
    }

    assignReceivable() {
        let origin = this.props.receivable;
        let payableDay = dateToInt(this.state.payableDay);
        let collectorId = this.state.collectorId;
        ReceivableService
            .assignReceivable(origin.Id, collectorId, payableDay)
            .then(res => {
                let dat = res.data;
                let newCollector = this.props.collectorList.find(co => co.Id === collectorId);
                origin.PayableDay = payableDay;
                origin.CollectionProgress = dat[0].CollectionProgress;
                if (newCollector) {
                    origin.collector = newCollector;
                }
                this.props.updateReceivable(origin);
                this.closeModal();
            }).catch(err => {
                errorAlert('Fail to assign receivable');
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
            successAlert('Update receivable successfully!');
            this.closeModal();
        }).catch(err => {
            errorAlert('Fail to update collector!');
            this.setState({ loadingForm: false })
        })
    }
    validate() {
        let val = true;
        if (!this.state.isPending) {
            if (!this.state.payableDay || this.state.collectorId === null) {
                val = false;
            } else val = true;
        }
        return val;
    }
    onChangeCollector = (e) => {
        var collector = e.target.value;
        let val = null;
        if (collector != undefined && collector != null) {
            val = collector.Id;
        }
        this.setState({
            collectorId: val,
            collector: collector
        })
    }
    render() {
        let receivable = this.props.receivable;
        let isPending = this.state.isPending;
        let modalClass = '';
        let componentClass = 'col-sm-12';
        let collectorComponent = null;
        if (receivable.CollectionProgress.Status === 4) {
            modalClass = 'normal-modal'
            componentClass = 'col-sm-6'
        }
        if (!isPending) {
            collectorComponent = <Form.Field className='full-combobox-holder'>
                <label>Collector:</label>
                <ComboBox data={this.props.collectorList}
                    dataItemKey='Id'
                    textField='DisplayName'
                    placeholder='Collector'
                    value={this.state.collector}
                    onChange={this.onChangeCollector} />
                <span style={{
                    color: 'red',
                    display: this.state.collectorId !== null ? 'none' : 'block'
                }}>Please choose collector</span>
            </Form.Field>
        }

        return (<div style={{ width: '30px', float: 'right', paddingRight: '20px' }}>
            <FontAwesomeIcon icon='pen' size='sm' color='black' className='icon-btn'
                id='edit-receivable-info' onClick={this.openModal} />
            <MyToolTip target='edit-receivable-info' message='Edit receivable info' />
            <Modal isOpen={this.state.modal} className={modalClass}>
                <ModalHeader>Update information of receivable</ModalHeader>
                <ModalBody>
                    <Form loading={this.state.loadingForm} onSubmit={this.updateReceivable}>
                        <div className='row'>
                            <div className={componentClass}>
                                {/* Debt amount */}
                                <Form.Field>
                                    <label>Debt amount:</label>
                                    <input type='number' min='0' required value={this.state.debtAmount}
                                        onChange={(e) => { this.setState({ debtAmount: parseInt(e.target.value) }) }} />
                                </Form.Field>
                                {/* Prepaid amount */}
                                <Form.Field>
                                    <label>Prepaid amount:</label>
                                    <input type='number' min='0' max={this.state.debtAmount} required value={this.state.prepaidAmount}
                                        onChange={(e) => { this.setState({ prepaidAmount: parseInt(e.target.value) }) }} />
                                </Form.Field>
                            </div>
                            <div className={componentClass}>
                                {/* Is pending? */}
                                {receivable.CollectionProgress.Status === 4 ? <Form.Field>
                                    <label>Is Pending?</label>
                                    <Checkbox checked={isPending} label='Yes' onChange={(e, data) => {
                                        this.setState({ isPending: data.checked });
                                    }} />
                                </Form.Field> : null}
                                {/* Payable day */}
                                {receivable.CollectionProgress.Status === 4 && !isPending ? <Form.Field>
                                    <label>Start day:</label>
                                    <DatePicker min={new Date()} value={this.state.payableDay}
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            this.setState({ payableDay: val });
                                        }} />
                                </Form.Field> : null}
                                {/* Collector */}
                                {collectorComponent}
                            </div>
                        </div>
                        <button ref='submit' type='submit' style={{ display: 'none' }}></button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"
                        disabled={!this.validate()}
                        onClick={() => { this.refs.submit.click() }}>OK</Button>
                    <Button color="secondary" onClick={this.closeModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div >);
    }
}

export default EditReceivable;