import { library } from '@fortawesome/fontawesome-svg-core';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Container, Header, Icon, Label } from 'semantic-ui-react';
import { AuthService } from '../../../services/auth-service';
import { CustomerService } from '../../../services/customer-service';
import { ProfileService } from '../../../services/profile-service';
import { ReceivableService } from '../../../services/receivable-service';
import { TaskService } from '../../../services/task-service';
import { UserService } from '../../../services/user-service';
import { UtilityService } from '../../../services/utility-service';
import { addDayAsInt, compareIntDate, dateToInt, numAsDate } from '../../../utils/time-converter';
import Component from '../../common/component';
import { available1, PrimaryLoadingPage } from '../../common/loading-page';
import { errorAlert, successAlert } from '../../common/my-menu';
import MyToolTip from '../../common/my-tooltip';
import ConfirmModal from '../../modal/ConfirmModal';
import Contact from '../contact-pages/contact';
import ChangeStatus from '../edit/change-status';
import EditReceivable from '../edit/edit-receivable';
import '../receivable.scss';
import CurrentStage from './current-stage';
import ReceivableProgress from './receivable-progress';
import SmsPhonecallHistory from './sms-phonecall-history';
import TaskHistory from './task-history';
import TodayTask from './today-task';
library.add(faCreditCard);

class ReceivableDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 8,
            receivable: null,
            currentStage: null,
            currentDate: dateToInt(new Date()),
            collectorList: [],
            customerList: [],
            todayTask: [],
            completeTask: [],
            openConfirm: false,
            profile: null,
            confirmHeader: '',
            confirmBody: '',
            confirmCallback: () => { }
        }
        this.updateReceivable = this.updateReceivable.bind(this);
        this.confirmReceivable = this.confirmReceivable.bind(this);
        this.reopenReceivable = this.reopenReceivable.bind(this);
        this.openConfirmReceivable = this.openConfirmReceivable.bind(this);
        this.openReopenReceivable = this.openReopenReceivable.bind(this);
    }
    updateReceivable(receivable = this.state.receivable, resolve = (receivable) => { }) {
        resolve(receivable);
        this.setState({ receivable: receivable });
    }
    componentDidMount() {
        document.title = 'Receivable detail';
        available1();
        let recceiId = this.props.match.params.id;
        UtilityService.getServerDate().then(res => {
            let serverDate = parseInt(res.data);
            this.setState({ currentDate: serverDate });
            this.incrementLoading();
        })
        ReceivableService.get(recceiId).then(res => {
            let receivable = res.data;
            this.setState({ receivable: receivable });
            this.incrementLoading();
            //get customer info
            CustomerService.get(receivable.CustomerId).then(res2 => {
                receivable.customer = res2.data;
                this.setState({ receivable: receivable });
                this.incrementLoading();
            })
            //[Receivable detail] get collector info
            if (receivable.assignedCollector && receivable.assignedCollector.CollectorId) {
                UserService.getCollectorDetail(receivable.assignedCollector.CollectorId).then(res3 => {
                    receivable.collector = res3.data;
                    this.setState({ receivable: receivable });
                    this.incrementLoading();
                })
            } else {
                this.incrementLoading();
            }
            //[Receivable detail] get today task of receivable
            if (receivable.CollectionProgress.Status == 1) {
                TaskService.getReceivableTodayTask(receivable.Id).then(res6 => {
                    this.setState({ todayTask: res6.data });
                    this.incrementLoading();
                })
            } else {
                this.incrementLoading();
            }
            //[Update receivable] get list collector
            UserService.getCollectors().then(res4 => {
                let list = res4.data;
                list.forEach(c => {
                    c.DisplayName = `${c.FirstName} ${c.LastName} (${c.Username})`;
                })
                this.setState({ collectorList: list });
                this.incrementLoading();
            })
            //[Update receivable] get list customer
            CustomerService.getAll().then(res5 => {
                this.setState({ customerList: res5.data });
                this.incrementLoading();
            })
            if (receivable.CollectionProgress) {
                ProfileService.getDetail(receivable.CollectionProgress.ProfileId).then(res6 => {
                    this.setState({ profile: res6.data });
                    this.incrementLoading();
                })
            } else {
                this.incrementLoading();
            }
        }).catch(err => {
            console.error(err);
            errorAlert('Service unavailable, please try again later!');
        })
    }
    confirmReceivable() {
        ReceivableService.confirm(this.state.receivable.Id).then(res => {
            this.state.receivable.IsConfirmed = true;
            this.setState(pre => ({
                receivable: pre.receivable
            }))
            successAlert('This case is confirmed!')
        }).catch(err => {
            console.error(err);
            errorAlert('Fail to confirm this receivable! Please try again later!');
        })
    }
    reopenReceivable() {
        ReceivableService.reopen(this.state.receivable.Id).then(res => {
            this.state.receivable.CollectionProgress.Status = 1;
            this.setState(pre => ({
                receivable: pre.receivable
            }))
            this.incrementLoading(-1);
            TaskService.getReceivableTodayTask(this.state.receivable.Id).then(res1 => {
                this.setState({ todayTask: res1.data });
                this.incrementLoading();
            })
            successAlert('This case is reopened!');
        }).catch(err => {
            console.error(err);
            errorAlert('Fail to reopen this receivable! Please try again later!');
        })
    }
    edit(e) {
        e.preventDefault();
    }
    changeStatus(e) {
        e.preventDefault();
    }
    groupAction(actions, stageDuration, startDate) {
        let groupActions = actions.reduce((group, action) => {
            let found = group.find(a => a.Name === action.Name || a.Type === action.type);
            if (found) {
                if (found.Type !== 3) {
                    found.Quantity = found.Quantity + 1;
                } else if (action.Name === found.Name) {
                    //notification but same name
                    found.Quantity = found.Quantity + 1;
                } else {
                    //notification but different name
                    group.push({
                        Name: action.Name,
                        Quantity: 1,
                        Type: action.Type,
                        Frequency: compareIntDate(startDate, action.ExcutionDay)
                    })
                }
            } else {
                group.push({
                    Name: action.Name,
                    Quantity: 1,
                    Type: action.Type,
                    Frequency: compareIntDate(startDate, action.ExcutionDay)
                })
            }
            return group;
        }, []);
        //sort by type
        groupActions.sort((g1, g2) => g1.Type - g2.Type);
        //count frequency
        groupActions.forEach(a => {
            let frequency = stageDuration / a.Quantity;
            if (a.Quantity > 1) {
                a.Frequency = frequency;
            }
        })
        return groupActions;
    }
    calculateStage(stages, payableDay, closedDay, receivableStatus) {
        let currentStage = null;
        let currentDate = this.state.currentDate;
        if (closedDay && (receivableStatus == 2 || receivableStatus == 0 || receivableStatus == 5)) {
            currentDate = closedDay;
        }
        let stageStartDay = payableDay;
        //sort stages by sequence
        stages.sort((s1, s2) => s1.Sequence - s2.Sequence);
        let processDuration = stages.reduce((acc, s) => { return acc + s.Duration }, 0);
        //calculate progress
        stages.forEach((stage) => {
            let endDay = addDayAsInt(stageStartDay, stage.Duration - 1);
            let nextStartDay = addDayAsInt(stageStartDay, stage.Duration);
            let rsStartDay = compareIntDate(stageStartDay, currentDate);
            let rsEndDay = compareIntDate(nextStartDay, currentDate);
            stage.startDate = stageStartDay;
            stage.endDate = endDay;
            stage.weight = (stage.Duration / processDuration) * 100;
            if (rsStartDay >= 0 && rsEndDay <= 0) {
                //in stage
                stage.isCurrentStage = true;
                stage.isIncommingStage = false;
                stage.percent = (rsStartDay * 1.0 / stage.Duration) * 100;
                currentStage = rsEndDay < 0 ? stage : null;
            } else if (rsStartDay < 0) {
                //incomming stage
                stage.percent = 0;
                stage.isCurrentStage = false;
                stage.isIncommingStage = true;
            } else if (rsEndDay > 0) {
                // finished stage
                stage.percent = 100;
                stage.isCurrentStage = false;
                stage.isIncommingStage = false;
            }
            stageStartDay = nextStartDay;
            //sort actions
            stage.Actions.sort((a1, a2) => {
                return a1.ExcutionDay - a2.ExcutionDay
            });
            //group actions
            stage.OriginalActions = this.groupAction(stage.Actions, stage.Duration, stage.startDate);
        })
        return currentStage;
    }
    openConfirmReceivable() {
        this.setState({
            openConfirm: true,
            confirmHeader: 'Confirm receivable',
            confirmBody: 'Are you sure want to confirm this receivable?',
            confirmCallback: this.confirmReceivable
        })
    }
    openReopenReceivable() {
        this.setState({
            openConfirm: true,
            confirmHeader: 'Reopen receivable',
            confirmBody: 'Are you sure want to reopen this receivable?',
            confirmCallback: this.reopenReceivable
        })
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />;
        }
        //#region Prepare for rendering
        let receivable = this.state.receivable;
        let collector = receivable.collector;
        let contacts = receivable != null ? receivable.Contacts : [];
        let debtor = null;
        contacts = contacts.filter((c) => {
            if (c.Type == 0) {
                debtor = c;
                return false;
            } else return true;
        })
        if (debtor != null) {
            document.title = `${debtor.Name}'s receivable`;
        }
        let stages = receivable.CollectionProgress.Stages;
        // check progrecess finished
        let isFinished = false;
        if (receivable) {
            let status = receivable.CollectionProgress.Status;
            isFinished = status === 0 || status === 5 || status === 2;
        }
        //get current stage
        let currentStage = this.calculateStage(stages, receivable.PayableDay, receivable.ClosedDay, receivable.CollectionProgress.Status);
        //get first date of process
        let totalDay = 0;
        let startDate = 0;
        let totalDuration = stages.reduce((acc, s) => acc + s.Duration, 0);
        if (stages.length > 0) {
            startDate = stages[0].startDate;
            totalDay = compareIntDate(startDate, this.state.currentDate);
            if (totalDay > totalDuration) {
                totalDay = totalDuration;
            }
        }

        // get end date of process
        let endDate = receivable.ClosedDay ? receivable.ClosedDay : null;
        let len = stages.length;
        if (!endDate && stages.length > 0) {
            endDate = stages[len - 1].endDate;
        }
        let dateNote = '';
        if (isFinished) {
            let tmp = compareIntDate(startDate, receivable.ClosedDay) + 1;
            tmp = tmp < 0 ? 0 : tmp;
            if (tmp > totalDuration) {
                tmp = totalDuration;
            }
            dateNote = `The process last ${tmp} day(s)`;
        } else if (totalDay < 0) {
            let tmp = Math.abs(totalDay);
            let dayMark = `after ${tmp} day(s)`;
            if (tmp === 1) {
                dayMark = 'Tomorrow';
            }
            dateNote = `Process will start ${dayMark}`;
        } else if (receivable.PayableDay !== null) {
            let tmp = totalDay + 1;
            let dayMark = `${totalDay + 1} day(s) ago`;
            if (tmp === 1) {
                dayMark = 'Today';
            } else if (tmp === 2) {
                dayMark = `Yesterday`;
            }
            dateNote = `Process started ${dayMark} `;
        }
        let status = describeStatus(receivable.CollectionProgress.Status);
        let statusColor = getStatusColor(receivable.CollectionProgress.Status);
        let reopenDisable = true;
        if (receivable.CollectionProgress.Status != 4) {
            let expectedClosedDay = stages[len - 1].endDate;
            reopenDisable = compareIntDate(expectedClosedDay, this.state.currentDate) >= 0;
        }
        //#endregion Prepare for rendering
        return (<div className='col-sm-12 row'>
            {/* History */}
            <div className='col-sm-3' style={{ boxSizing: 'border-box', fontSize: '0.9rem' }}>
                <br />
                <div className='col-sm-12'>
                    {/* show current date */}
                    <span>Today is <b>{` ${numAsDate(this.state.currentDate)}`}</b></span>
                </div>
                <div className='col-sm-12'>
                    <SmsPhonecallHistory currentDate={receivable.ClosedDay &&
                        receivable.CollectionProgress.Status != 1 && receivable.CollectionProgress.Status != 4 ? receivable.ClosedDay : this.state.currentDate} showResend={receivable.CollectionProgress.Status == 1} stages={receivable.CollectionProgress.Stages} /><br />
                    <TaskHistory currentDate={receivable.ClosedDay &&
                        receivable.CollectionProgress.Status != 1 && receivable.CollectionProgress.Status != 4 ? receivable.ClosedDay : this.state.currentDate} stages={receivable.CollectionProgress.Stages} /><br />
                    {isFinished ? null : <TodayTask todayTask={this.state.todayTask} />}
                </div>
            </div>
            {/* Progress bar */}
            <div className='col-sm-9 receivable-progress row no-space-side' style={{ padding: '0px' }}>
                {/* receivable progress */}
                <ReceivableProgress isFinished={isFinished} progress={receivable.CollectionProgress} />
                {/* show date note*/}
                {receivable.PayableDay !== null ? <div className='col-sm-12' style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.95rem' }}>
                    <span style={{ color: 'red' }}>*</span>
                    {dateNote}</div> : null}
            </div>

            <div className='col-sm-12 row justify-content-center'>
                {/* receivable information */}
                <div className='col-sm-4'>
                    <Container>
                        <Header>
                            <FontAwesomeIcon icon='credit-card' color='black' size='md' style={{ marginRight: '10px' }} />
                            Receivable Info <Label style={{ backgroundColor: statusColor, color: 'white' }}>{status}</Label>
                            {/* Edit info of receivable */}
                            {receivable.CollectionProgress.Status === 1 || receivable.CollectionProgress.Status === 4 ?
                                <EditReceivable updateReceivable={this.updateReceivable}
                                    receivable={receivable}
                                    collectorList={this.state.collectorList} /> : null}
                        </Header>
                        {/* Receivable info */}
                        <div className='info-card'>
                            <table className='info-table'>
                                <tbody>
                                    {isFinished && receivable.CollectionProgress.Status === 2 ? <tr>
                                        <td colSpan='2' className='text-center'>
                                            <i style={{ color: 'red' }}>NOT CONFIRM!!</i>
                                        </td>
                                    </tr> : null}
                                    <tr>
                                        <td>Debt amount</td>
                                        <td>: {receivable.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                                    </tr>
                                    <tr>
                                        <td>Prepaid amount</td>
                                        <td>: {receivable.PrepaidAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                                    </tr>
                                    <tr>
                                        <td>Partner</td>
                                        <td>: {receivable.customer ? receivable.customer.Name : null}</td>
                                    </tr>
                                    <tr>
                                        <td>Start day</td>
                                        <td>: {receivable.PayableDay ? numAsDate(receivable.PayableDay) : 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td>End day</td>
                                        <td>
                                            : {`${(endDate ? numAsDate(endDate) : '')}${(!isFinished && receivable.PayableDay ? ' (Expectation)' : 'N/A')}`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Collector</td>
                                        <td>
                                            : {collector ? `${collector.FirstName} ${collector.LastName}` : 'N/A'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Procedure</td>
                                        <td>
                                            : {this.state.profile ?
                                                (AuthService.isManager() ? <a target='_blank'
                                                    href={`/profile/${this.state.profile.Id}/view`}>
                                                    {this.state.profile.Name}
                                                </a> : this.state.profile.Name) : null}
                                        </td>
                                    </tr>
                                    {isFinished && receivable.CollectionProgress.Status !== 2 && !receivable.IsConfirmed && AuthService.isManager() ?
                                        <tr>
                                            <td colSpan='2' style={{ boxSizing: 'border-box' }}>
                                                <Button.Group style={{ marginLeft: '5%' }}>
                                                    <Button positive onClick={this.openConfirmReceivable}>Confirm</Button>
                                                    <Button.Or />
                                                    <Button color='orange' disabled={reopenDisable}
                                                        onClick={this.openReopenReceivable}>Reopen</Button>
                                                </Button.Group>

                                                {reopenDisable ?
                                                    [<Icon name='question' id='btn-reopen-question' inverted color='orange' size='small' circular />,
                                                    <MyToolTip target='btn-reopen-question'
                                                        message='You can not reopen this receivable because the collection progress is ended!' />] : null}
                                                <ConfirmModal
                                                    show={this.state.openConfirm}
                                                    onHide={() => { this.setState({ openConfirm: false }) }}
                                                    header={this.state.confirmHeader}
                                                    body={this.state.confirmBody}
                                                    callback={this.state.confirmCallback}
                                                />
                                            </td>
                                        </tr> : null}
                                </tbody>
                            </table>
                        </div>
                    </Container>
                </div>

                <div className='col-sm-4'>
                    {/* Debtor */}
                    <Contact isFinished={isFinished} style={{ marginBottom: '20px' }} title='Debtor'
                        isDebtor={true} contacts={debtor !== null ? [debtor] : []}
                        style={{ marginBottom: '20px' }}
                        updateReceivable={this.updateReceivable} >
                        {/* contacts */}
                        <div className='col-sm-12' style={{ marginTop: '20px' }}>
                            {/* Relatives (only visible for collector)*/}
                            <Contact isFinished={isFinished} title='Contact list'
                                isDebtor={false} contacts={contacts}
                                updateReceivable={this.updateReceivable} receivableId={receivable.Id} />
                        </div>
                    </Contact>
                </div>

                {/* Current stage */}
                {/* if current stage not null */}
                {receivable.CollectionProgress.Status === 1 || receivable.CollectionProgress.Status === 2 ?
                    <div className='col-sm-4' style={{ display: !currentStage && AuthService.isManager() ? 'none' : 'block' }}>
                        <CurrentStage currentDate={this.state.currentDate} currentStage={currentStage}>
                            {/* Change status of receivable */}
                            <ChangeStatus updateReceivable={this.updateReceivable} receivable={receivable} />
                        </CurrentStage>
                    </div> : null}
            </div>
        </div>);
    }
}

const statusWeight = [
    { status: 'Collecting', weight: 5 },
    { status: 'Pending', weight: 4 },
    { status: 'Done', weight: 3 },
    { status: 'Closed', weight: 2 },
    { status: 'Cancel', weight: 1 }
]

export const compareStatus = (a, b) => {
    let aWeight = describeStatus(a), bWeight = describeStatus(b);
    aWeight = statusWeight.find(sw => sw.status === aWeight).weight;
    bWeight = statusWeight.find(sw => sw.status === bWeight).weight;
    return bWeight - aWeight;
}

export const getStatusColor = (status) => {
    let statusColor = 'grey';
    switch (status) {
        case 0:
            // Cancel
            statusColor = '#dc3545';
            break;
        case 1: statusColor = '#007bff';
            break;
        case 2:
            // Done
            statusColor = '#17a2b8';
            break;
        case 4:
            // Pending
            statusColor = '#ffc107';
            break;
        // Closed
        case 5: statusColor = '#28a745';
            break;
    }
    return statusColor;
}

export const describeStatus = (status) => {
    let rs = status;
    switch (status) {
        case 0:
            // Cancel
            rs = 'Cancel';
            break;
        case 1: rs = 'Collecting';
            break;
        case 2:
            // Done
            rs = 'Done';
            break;
        case 4:
            // Pending
            rs = 'Pending';
            break;
        case 5:
            // Closed
            rs = 'Closed';
            break;
    }
    return rs;
}

export const describeGroupActionFrequency = (frequency) => {
    let rs;
    if (frequency >= 1) {
        frequency = Math.ceil(frequency);
        rs = `${frequency} day${frequency >= 2 ? 's' : ''}/time`;
    } else {
        rs = `${Math.floor(1 / frequency)} times per day`;
    }
    return rs;
}

export const describeActionType = (name, type) => {
    switch (type) {
        case 0: name = 'SMS (auto)'; break;
        case 1: name = 'Phone call (auto)'; break;
        case 2: name = 'Visit'; break;
    }
    return name;
}

export default ReceivableDetail;