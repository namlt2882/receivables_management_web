import React from 'react';
import Component from '../../common/component'
import { available1, PrimaryLoadingPage } from '../../common/loading-page';
import { ReceivableService } from '../../../services/receivable-service';
import { Table, Card, CardBody, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import Contact from '../contact-pages/contact'
import '../receivable.scss'
import { dateToInt, compareIntDate, addDayAsInt, numAsDate } from '../../../utils/time-converter';
import { CustomerService } from '../../../services/customer-service';
import ReiceivableProgress from './receivable-progress'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import ReceivableProgress from './receivable-progress';
import CurrentStage from './current-stage';
import ActionHistory from './action-history';
library.add(faCreditCard);

class ReceivableDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 2,
            receivable: null,
            customer: null,
            currentStage: null
        }
    }
    componentDidMount() {
        available1();
        let recceiId = this.props.match.params.id;
        ReceivableService.get(recceiId).then(res => {
            let receivable = res.data;
            this.setState({ receivable: receivable });
            this.incrementLoading();
            CustomerService.get(receivable.CustomerId).then(res2 => {
                this.setState({ customer: res2.data })
                this.incrementLoading();
            })
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
                } else if (found.Name.toUppercase() === found.Name.toUppercase()) {
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
    calculateStage(stages, payableDay) {
        let currentStage = null;
        let currentDate = dateToInt(new Date());
        let stageStartDay = payableDay;
        //sort stages by sequence
        stages.sort((s1, s2) => s1.Sequence - s2.Sequence);
        //calculate progress
        stages.forEach((stage) => {
            let endDay = addDayAsInt(stageStartDay, stage.Duration - 1);
            let nextStartDay = addDayAsInt(stageStartDay, stage.Duration);
            let rsStartDay = compareIntDate(stageStartDay, currentDate);
            let rsEndDay = compareIntDate(nextStartDay, currentDate);
            stage.startDate = stageStartDay;
            stage.endDate = endDay;
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
        let contacts = receivable != null ? receivable.Contacts : [];
        let debtor = null;
        contacts = contacts.filter((c) => {
            if (c.Type == 0) {
                debtor = c;
                return false;
            } else return true;
        })
        let stages = receivable.CollectionProgress.Stages;
        let currentStage = this.calculateStage(stages, receivable.PayableDay);
        return (<div className='col-sm-12 row'>
            {/* receivable progress */}
            <div className='col-sm-12 receivable-progress'>
                <ReceivableProgress progress={receivable.CollectionProgress} />
                <ActionHistory stages={receivable.CollectionProgress.Stages} />
            </div>
            {/* Current stage */}
            {receivable.ClosedDay == null && currentStage != null ? <div className='col-sm-12'>
                <CurrentStage currentStage={currentStage} />
            </div> : null}

            {/* receivable information */}
            <div className='col-sm-6'>
                <Card>
                    <CardTitle>
                        <FontAwesomeIcon icon='credit-card' color='black' size='md' style={{ marginRight: '10px' }} />
                        Receivable Info
                        </CardTitle>
                    <CardBody>
                        <Table className='info-table' hover>
                            <tbody>
                                <tr>
                                    <td>Debt amount:</td>
                                    <td>{receivable.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                                </tr>
                                <tr>
                                    <td>Prepaid amount:</td>
                                    <td>{receivable.PrepaidAmount}</td>
                                </tr>
                                <tr>
                                    <td>Customer:</td>
                                    <td>{this.state.customer.Name}</td>
                                </tr>
                                <tr>
                                    <td>Start day:</td>
                                    <td>{numAsDate(receivable.PayableDay)}</td>
                                </tr>
                                <tr>
                                    <td>End day:</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Collector:</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Status:</td>
                                    <td>{describeStatus(receivable.CollectionProgress.Status)}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <a href='' onClick={this.edit} style={{ marginRight: '15px' }}>Edit</a>
                        <a href='' onClick={this.changeStatus}>Change status</a>
                    </CardBody>
                </Card>
            </div>
            {/* contacts */}
            <div className='col-sm-6'>
                {/* Debtor */}
                <Contact title='Debtor' isDebtor={true} contacts={debtor !== null ? [debtor] : []} style={{ marginBottom: '20px' }} />
                {/* Relatives */}
                <Contact title='Relatives' isDebtor={false} contacts={contacts} />
            </div>
        </div>);
    }
}

export const describeStatus = (status) => {
    let rs = status;
    switch (status) {
        case 0: rs = 'Cancel';
            break;
        case 1: rs = 'Collection';
            break;
        case 2: rs = 'Done';
            break;
        case 3: rs = 'Late';
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