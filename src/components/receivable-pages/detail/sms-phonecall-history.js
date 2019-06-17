import classnames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink } from 'reactstrap';
import { Button, Divider, Label } from 'semantic-ui-react';
import { SmsAndPhonecallAction } from '../../../actions/sms-and-phonecall-action';
import { AuthService } from '../../../services/auth-service';
import { TaskService } from '../../../services/task-service';
import { numAsDate, numAsTime, compareIntDate } from '../../../utils/time-converter';
import { errorAlert, successAlert } from '../../common/my-menu';
import ConfirmModal from '../../modal/ConfirmModal';

class SmsPhonecallHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            total: 0,
            stages: this.props.stages,
            openConfirm: false,
            onConfirm: () => { this.setState({ openConfirm: false }) },
            actionName: '',
            showSuccess: true,
            totalSuccess: 0,
            totalNotSuccess: 0
        }
        this.showHistory = this.showHistory.bind(this);
        this.closeModel = this.closeModel.bind(this);
        this.setOnConfirm = this.setOnConfirm.bind(this);
        this.toggleShowSuccessAction = this.toggleShowSuccessAction.bind(this);
        this.filterAction = this.filterAction.bind(this);
        this.updateStages = this.updateStages.bind(this);
    }
    toggleShowSuccessAction() {
        let showSuccess = !this.state.showSuccess;
        this.setState({ showSuccess: showSuccess })
        let stages = this.state.stages;
        stages = this.filterAction(stages, showSuccess);
        this.setState({ stages: stages });
    }
    setOnConfirm(actionName, onConfirm) {
        this.setState({
            openConfirm: true,
            actionName: actionName,
            onConfirm: () => {
                onConfirm();
                this.setState({ openConfirm: false })
            }
        })
    }
    componentDidMount() {
        let stages = this.state.stages;
        let modal = this.state.modal;
        let showSuccess = this.state.showSuccess;
        if (this.props.smsAndPhonecall.open) {
            modal = true;
            showSuccess = false;
            this.props.setSmsAndPhonecallClose();
        }
        stages = this.filterAction(stages, showSuccess);
        this.setState({
            stages: stages,
            modal: modal,
            showSuccess: showSuccess
        });
    }
    filterAction(stages, showSuccess = this.state.showSuccess) {
        let totalSuccess = 0;
        let totalNotSuccess = 0;
        let currentDate = this.props.currentDate;
        stages.forEach(stage => {
            stage.history_actions = stage.Actions
                .filter(a => compareIntDate(a.ExcutionDay, currentDate) >= 0)
                .filter(a => {
                let rsSuccess = a.Status !== 1 && a.Status === 2 && (a.Type === 0 || a.Type === 1);
                if (rsSuccess) {
                    totalSuccess++;
                }
                let rsNotSuccess = a.Status !== 1 && a.Status !== 2 && (a.Type === 0 || a.Type === 1)
                if (rsNotSuccess) {
                    totalNotSuccess++;
                }
                if (showSuccess) {
                    return rsSuccess;
                } else {
                    return rsNotSuccess;
                }
            });
        })
        this.setState({
            total: totalSuccess + totalNotSuccess,
            totalNotSuccess: totalNotSuccess,
            totalSuccess: totalSuccess
        })
        return stages;
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
    updateStages(stages = this.state.stages) {
        this.setState({ stages: stages })
    }
    render() {
        let stages = this.state.stages;
        let isEmpty = true;
        return (<div>
            <a href='' onClick={this.showHistory} style={{ float: 'left' }}><i>{`SMS and Phone call history (${this.state.total})`}</i></a>
            <Modal isOpen={this.state.modal} className='big-modal'>
                <ModalHeader toggle={this.toggle}>
                    <Nav tabs>
                        <NavItem>
                            <NavLink className={classnames({ active: this.state.showSuccess })}
                                onClick={this.toggleShowSuccessAction}>
                                {`Success SMS and Phone call history (${this.state.totalSuccess})`}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({ active: !this.state.showSuccess })}
                                onClick={this.toggleShowSuccessAction}>
                                {`Fail SMS and Phone call history (${this.state.totalNotSuccess})`}
                            </NavLink>
                        </NavItem>
                    </Nav>
                </ModalHeader>
                <ModalBody>
                    {stages.map((stage, i) => {
                        let actions = stage.history_actions;
                        if (!actions) {
                            return null;
                        }
                        if (isEmpty && actions.length > 0) {
                            isEmpty = false;
                        }
                        if (actions.length <= 0) {
                            return null;
                        }
                        return <div>
                            {i >= 1 ? <Divider /> : null}
                            <span><h3>{stage.Name}</h3></span>
                            <table className='table thin text-center'>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Time</th>
                                        <th>Count</th>
                                        <th>Status</th>
                                        <th style={{ display: AuthService.isManager() ? 'none' : 'table-cell' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actions.map((action, i) => {
                                        return <ActionRecord showResend={this.props.showResend} updateStages={this.updateStages} setOnConfirm={this.setOnConfirm} action={action} key={i} />
                                    })}
                                </tbody>
                            </table>
                        </div>
                    })}
                    {isEmpty ? <span>Sorry, SMS and phone call history is empty!</span> : null}
                    <ConfirmModal
                        show={this.state.openConfirm}
                        onHide={() => { this.setState({ openConfirm: false }) }}
                        header='Confirm'
                        body={`Do you want to resent this ${this.state.actionName}?`}
                        callback={this.state.onConfirm}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.closeModel}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

class ActionRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.resendAction = this.resendAction.bind(this);
    }

    resendAction() {
        let action = this.props.action;
        this.setState({ loading: true });
        TaskService.makeManualAction(action.Id).then(res => {
            let action1 = res.data;
            action.Note = action1.Note;
            action.Status = action1.Status;
            if (action.Status == 2) {
                successAlert(`${action.Name} has been resent to debtor!`);
            } else {
                errorAlert(`Fail to resend ${action.Name}, please try again later!`);
            }
            this.props.updateStages();
            this.setState({ loading: false });
        }).catch(err => {
            console.error(err);
            this.setState({ loading: false });
            errorAlert('Something went wrong, please try again!');
        })
    }

    render() {
        let action = this.props.action;
        let date = numAsDate(action.ExcutionDay);
        let time = numAsTime(action.StartTime);
        let color = 'red';
        switch (action.Status) {
            case 1:
                color = 'blue'
                break;
            case 2:
                color = 'green'
                break;
        }
        return (<tr>
            <td>{action.Name}</td>
            <td>
                <span>At{` ${date} ${time}`}</span>
            </td>
            <td>
                {/* {action.Status != 2 ? '4' : '1'} */}
                {action.Note}
            </td>
            <td>
                <Label color={color}>{describeActionStatus(action.Status, true)}</Label>
            </td>
            <td style={{ display: AuthService.isManager() ? 'none' : 'table-cell' }}>
                {(action.Status == 0) && this.props.showResend ?
                    <Button loading={this.state.loading} color='primary'
                        onClick={() => {
                            this.props.setOnConfirm(action.Name, this.resendAction)
                        }}>Resend</Button> : null}</td>
        </tr>);
    }
}

const describeActionStatus = (status, smsOrPhonecall = false) => {
    switch (status) {
        case 1:
            return 'In-order';
        case 2: return 'Done';
        case 3:
            if (smsOrPhonecall) {
                return 'Cancel'
            }
            return 'Late';
        default: return 'Cancel';
    }
}
const mapStateToProps = state => {
    return {
        smsAndPhonecall: state.smsAndPhonecall
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setSmsAndPhonecallClose: () => {
            dispatch(SmsAndPhonecallAction.setOpen(false));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SmsPhonecallHistory);