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
import { Button, Container, Header, Table, Divider } from 'semantic-ui-react'
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
    }
    updateReceivable(receivable) {
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
            UserService.getCollectorDetail(receivable.assignedCollector.CollectorId).then(res3 => {
                receivable.collector = res3.data;
                this.setState({ receivable: receivable });
                this.incrementLoading();
            })
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
                this.setState({ collectorList: res4.data });
                this.incrementLoading();
            })
            //[Update receivable] get list customer
            CustomerService.getAll().then(res5 => {
                this.setState({ customerList: res5.data });
                this.incrementLoading();
            })
        }).catch(err => {
            if (err.response.status === 404) {
                this.props.history.push('/not-found');
            }
        })
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
        } else {
            let tmp = totalDay + 1;
            let dayMark = `${totalDay + 1} day(s) ago`;
            if (tmp === 1) {
                dayMark = 'Today';
            } else if (tmp === 2) {
                dayMark = `Yesterday`;
            }
            dateNote = `Process started ${dayMark} `;
        }
        return (<div className='col-sm-12 row'>
            {/* History */}
            <div className='col-sm-3 row'>
                <div className='col-sm-12'>
                    {/* show current date */}
                    <div style={{ textAlign: 'left' }}><b>Today</b>: {numAsDate(this.state.currentDate)}</div>
                    {isFinished ? <div style={{ textAlign: 'right' }}><b>Closed day</b>: {numAsDate(receivable.ClosedDay)}</div> : null}
                </div>
                <div className='col-sm-12'>
                    <ActionHistory stages={receivable.CollectionProgress.Stages} /><br />
                    {isFinished ? null : <TaskHistory todayTask={this.state.todayTask} />}
                </div>
            </div>
            {/* Progress bar */}
            <div className='col-sm-9 receivable-progress row' style={{ padding: '0px' }}>
                {/* receivable progress */}
                <ReceivableProgress progress={receivable.CollectionProgress} />
                {/* show date note*/}
                <div className='col-sm-12' style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.95rem' }}>
                    <span style={{ color: 'red' }}>*</span>
                    {dateNote}</div>
            </div>
            {/* Current stage */}
            {/* if current stage not null */}
            {!isFinished && currentStage != null ? <div className='col-sm-12'>
                <Divider />
                <CurrentStage currentDate={this.state.currentDate} currentStage={currentStage} />
                <Divider />
            </div> : null}

            {/* receivable information */}
            <div className='col-sm-6'>
                <Container>
                    <Header>
                        <FontAwesomeIcon icon='credit-card' color='black' size='md' style={{ marginRight: '10px' }} />
                        Receivable Info
                        {/* Edit info of receivable */}
                        {receivable.CollectionProgress.Status === 1 ?
                            <EditReceivable updateReceivable={this.updateReceivable}
                                receivable={receivable}
                                collectorList={this.state.collectorList} /> : null}
                    </Header>
                    {/* Receivable info */}
                    <Table className='info-table' hover>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>Debt amount:</Table.Cell>
                                <Table.Cell>{receivable.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Prepaid amount:</Table.Cell>
                                <Table.Cell>{receivable.PrepaidAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Customer:</Table.Cell>
                                <Table.Cell>{receivable.customer ? receivable.customer.Name : null}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Start day:</Table.Cell>
                                <Table.Cell>{numAsDate(receivable.PayableDay)}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>End day:</Table.Cell>
                                <Table.Cell>
                                    {`${(endDate ? numAsDate(endDate) : '')}${(!receivable.ClosedDay ? ' (Expectation)' : '')}`}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Collector:</Table.Cell>
                                <Table.Cell>
                                    {collector ? `${collector.FirstName} ${collector.LastName}` : ''}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>Status:</Table.Cell>
                                <Table.Cell>{describeStatus(receivable.CollectionProgress.Status)}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell></Table.Cell>
                                <Table.Cell>
                                    {/* Change status of receivable */}
                                    {receivable.CollectionProgress.Status === 1 ?
                                        <ChangeStatus updateReceivable={this.updateReceivable} debtor={debtor} receivable={receivable} /> : null}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Container>
            </div>
            {/* contacts */}
            <div className='col-sm-6'>
                {/* Debtor */}
                <Contact style={{ marginBottom: '20px' }} title='Debtor' isDebtor={true} contacts={debtor !== null ? [debtor] : []} style={{ marginBottom: '20px' }} />
            </div>
            <div className='col-sm-12' style={{marginTop:'20px'}}>
                {/* Relatives (only visible for collector)*/}
                {AuthService.isCollector() ? <Contact title='Relatives' isDebtor={false} contacts={contacts} /> : null}
            </div>
        </div>);
    }
}

export const describeStatus = (status) => {
    let rs = status;
    switch (status) {
        case 0: rs = 'Cancel';
            break;
        case 1: rs = 'Collecting';
            break;
        case 2: rs = 'Done';
            break;
        case 3: rs = 'Late';
            break;
        case 4: rs = 'Wait'; break;
        case 5: rs = 'Closed'; break;
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