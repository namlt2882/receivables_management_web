import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { AuthService } from '../../../services/auth-service';
import { ReceivableService } from '../../../services/receivable-service';
import { errorAlert, infoAlert, successAlert } from '../../common/my-menu';
import ConfirmModal from '../../modal/ConfirmModal';

class ChangeStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            showTodayTask: true,
            receivable: this.props.receivable,
            status: this.props.receivable.CollectionProgress.Status,
            openConfirm: false,
            confirmMessage: '',
            changeStatus: () => { },
            header: ''
        }
        this.openForm = this.openForm.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.confirm = this.confirm.bind(this);
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
    confirm(isPayed) {
        let message = 'This action means the receivable is SUCCESSFULLY collected and will be CLOSED. Please confirm this action.';
        let header = 'Confirm to close this receivable'
        if (!isPayed) {
            message = 'This action means the receivable is FAIL to collect and will be CANCEL. Please confirm this action.';
            header = 'Confirm to cancel this receivable'
        }
        this.setState({
            openConfirm: true,
            confirmMessage: message,
            changeStatus: () => {
                this.changeStatus(isPayed);
            },
            header: header
        });
    }
    changeStatus(isPayed) {
        let successMsg = 'This receivable has been CANCEL!';
        if (isPayed) {
            successMsg = 'This receivable has been CLOSED!';
        }
        let data = {
            Id: this.state.receivable.Id,
            isPayed: isPayed
        }
        ReceivableService.closeReceivable(data).then(res => {
            let rs = res.data;
            this.state.receivable.CollectionProgress.Status = rs.Status;
            this.state.receivable.ClosedDay = rs.ClosedTime;
            this.props.updateReceivable(this.state.receivable);
            successAlert(successMsg);
        }).catch(err => {
            console.error(err);
            errorAlert('Service unvailable! Please try again later!');
        })
    }
    render() {
        return (<div>
            {AuthService.isCollector() ?
                [<div style={{ marginLeft: '5%', display: 'inline-block' }}>
                    <Button content='Finish' color='blue' icon='check' labelPosition='left'
                        style={{ width: '8rem', display: 'inline-block' }}
                        onClick={() => { this.confirm(true) }} />
                </div>,
                <div style={{ marginLeft: '10%', display: 'inline-block' }}>
                    <Button content='Stop' color='red' icon='cancel' labelPosition='left'
                        style={{ width: '8rem' }}
                        onClick={() => { this.confirm(false) }} />
                </div>] : null}
            <ConfirmModal
                show={this.state.openConfirm}
                onHide={() => { this.setState({ openConfirm: false }) }}
                header={this.state.header}
                body={this.state.confirmMessage}
                callback={this.state.changeStatus} />
        </div>);
    }
}

export default ChangeStatus;