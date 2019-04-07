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
            changeStatus: () => { }
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
        let message = 'The debt is collected successfully. This action will CLOSE this case, please confirm this action.';
        if (!isPayed) {
            message = 'This action will CANCEL this case, please confirm this action.';
        }
        this.setState({
            openConfirm: true,
            confirmMessage: message,
            changeStatus: () => {
                this.changeStatus(isPayed);
            }
        });
    }
    changeStatus(isPayed) {
        let successMsg = 'This receivable has been cancel!';
        if (isPayed) {
            successMsg = 'This receivable has been closed!';
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
            if (isPayed) {
                successAlert(successMsg);
            } else {
                infoAlert(successMsg);
            }
        }).catch(err => {
            console.error(err);
            errorAlert('Fail to change status of this receivable! Please try again later!');
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
                header='Confirm'
                body={this.state.confirmMessage}
                callback={this.state.changeStatus} />
        </div>);
    }
}

export default ChangeStatus;