import React from 'react';
import Component from '../../common/component'
import { available1, PrimaryLoadingPage } from '../../common/loading-page';
import { ReceivableService } from '../../../services/receivable-service';
import Contact from '../contact-pages/contact'
import '../receivable.scss'
import { dateToInt, compareIntDate, addDayAsInt, numAsDate } from '../../../utils/time-converter';
import { CustomerService } from '../../../services/customer-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import ReceivableProgress from './receivable-progress';
import CurrentStage from './current-stage';
import ActionHistory from './action-history';
import { Container, Header, Table, Divider, Label, Button } from 'semantic-ui-react'
import { UserService } from '../../../services/user-service';
import { UtilityService } from '../../../services/utility-service';
import { AuthService } from '../../../services/auth-service';
import TaskHistory from './task-history';
import ChangeStatus from '../edit/change-status';
import EditReceivable from '../edit/edit-receivable';
import { TaskService } from '../../../services/task-service';
library.add(faCreditCard);

class ReceivableDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 7,
            receivable: null,
            currentStage: null,
            currentDate: dateToInt(new Date()),
            collectorList: [],
            customerList: [],
            todayTask: []
        }
        this.updateReceivable = this.updateReceivable.bind(this);
        this.confirm = this.confirm.bind(this);
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
            if (!receivable.ClosedDay) {
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
        }).catch(err => {
        })
    }
    confirm() {
        if (window.confirm('This case will be closed?')) {
            ReceivableService.confirm(this.state.receivable.Id).then(res => {
                this.state.receivable.IsConfirmed = true;
                this.setState(pre => ({
                    receivable: pre.receivable
                }))
            })
        }
    }
    edit(e) {
        e.preventDefault();
    }
    changeStatus(e) {
        e.preventDefault();
    }
    groupAction(actions, stageDuration) {
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
                        Type: action.Type
                    })
                }
            } else {
                group.push({
                    Name: action.Name,
                    Quantity: 1,
                    Type: action.Type
                })
            }
            return group;
        }, []);
        //sort by type
        groupActions.sort((g1, g2) => g1.Type - g2.Type);
        //count frequency
        groupActions.forEach(a => {
            let frequency = stageDuration / a.Quantity;
            a.Frequency = frequency;
        })
        return groupActions;
    }
    calculateStage(stages, payableDay, closedDay) {
        let currentStage = null;
        let currentDate = this.state.currentDate;
        if (closedDay) {
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
                currentStage = stage;
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
            stage.OriginalActions = this.groupAction(stage.Actions, stage.Duration);
        })
        return currentStage;
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />;
        }
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
            isFinished = receivable.ClosedDay !== null;
        }
        //get current stage
        let currentStage = this.calculateStage(stages, receivable.PayableDay, receivable.ClosedDay);
        //get first date of process
        let totalDay = 0;
        let startDate = 0;
        if (stages.length > 0) {
            startDate = stages[0].startDate;
            totalDay = compareIntDate(startDate, this.state.currentDate);
        }

        // get end date of process
        let endDate = receivable.ClosedDay ? receivable.ClosedDay : null;
        if (!endDate && stages.length > 0) {
            let len = stages.length;
            endDate = stages[len - 1].endDate;
        }
        let dateNote = '';
        if (isFinished) {
            let tmp = compareIntDate(startDate, receivable.ClosedDay) + 1;
            tmp = tmp < 0 ? 0 : tmp;
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
        return (<div className='col-sm-12 row'>
            {/* History */}
            <div className='col-sm-3' style={{ boxSizing: 'border-box', fontSize: '0.9rem' }}>
                <br />
                <div className='col-sm-12'>
                    {/* show current date */}
                    <span>Today is <b>{` ${numAsDate(this.state.currentDate)}`}</b></span>
                </div>
                <div className='col-sm-12'>
                    <ActionHistory stages={receivable.CollectionProgress.Stages} /><br />
                    {isFinished ? null : <TaskHistory todayTask={this.state.todayTask} />}
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

            {/* receivable information */}
            <div className='col-sm-6'>
                <Container>
                    <Header>
                        <FontAwesomeIcon icon='credit-card' color='black' size='md' style={{ marginRight: '10px' }} />
                        Receivable Info <Label color={statusColor}>{status}</Label>
                        {/* Edit info of receivable */}
                        {receivable.CollectionProgress.Status === 1 || receivable.CollectionProgress.Status === 4 ?
                            <EditReceivable updateReceivable={this.updateReceivable}
                                receivable={receivable}
                                collectorList={this.state.collectorList} /> : null}
                    </Header>
                    {/* Receivable info */}
                    <table className='info-table' style={{ marginBottom: '20px' }} hover>
                        <tbody>
                            <tr>
                                <td>Debt amount:</td>
                                <td>{receivable.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                            </tr>
                            <tr>
                                <td>Prepaid amount:</td>
                                <td>{receivable.PrepaidAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                            </tr>
                            <tr>
                                <td>Customer:</td>
                                <td>{receivable.customer ? receivable.customer.Name : null}</td>
                            </tr>
                            <tr>
                                <td>Start day:</td>
                                <td>{numAsDate(receivable.PayableDay)}</td>
                            </tr>
                            <tr>
                                <td>End day:</td>
                                <td>
                                    {`${(endDate ? numAsDate(endDate) : '')}${(!isFinished && receivable.PayableDay ? ' (Expectation)' : '')}`}
                                </td>
                            </tr>
                            <tr>
                                <td>Collector:</td>
                                <td>
                                    {collector ? `${collector.FirstName} ${collector.LastName}` : ''}
                                </td>
                            </tr>
                            {isFinished && !receivable.IsConfirmed && AuthService.isManager() ?
                                <tr>
                                    <td></td>
                                    <td>
                                        <Button color='green' onClick={this.confirm}>Confirm</Button>
                                    </td>
                                </tr> : null}
                        </tbody>
                    </table>
                </Container>
            </div>

            {/* Current stage */}
            {/* if current stage not null */}
            {!isFinished && currentStage != null ? <div className='col-sm-6'>
                <CurrentStage currentDate={this.state.currentDate} currentStage={currentStage}>
                    {/* Change status of receivable */}
                    {receivable.CollectionProgress.Status === 1 ?
                        <ChangeStatus updateReceivable={this.updateReceivable} receivable={receivable} /> : null}
                </CurrentStage>
            </div> : null}
            {/* contacts */}
            <div className='col-sm-6'>
                {/* Debtor */}
                <Contact isFinished={isFinished} style={{ marginBottom: '20px' }} title='Debtor'
                    isDebtor={true} contacts={debtor !== null ? [debtor] : []}
                    style={{ marginBottom: '20px' }}
                    updateReceivable={this.updateReceivable} />
            </div>
            <div className='col-sm-12' style={{ marginTop: '20px' }}>
                {/* Relatives (only visible for collector)*/}
                {AuthService.isCollector() ? <Contact isFinished={isFinished} title='Relatives'
                    isDebtor={false} contacts={contacts}
                    updateReceivable={this.updateReceivable} /> : null}
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
            statusColor = 'red';
            break;
        case 1: statusColor = 'green';
            break;
        case 2:
            // Done
            statusColor = 'blue';
            break;
        case 4:
            // Pending
            statusColor = 'orange';
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